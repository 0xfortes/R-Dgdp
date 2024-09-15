import requests
from django.core.management.base import BaseCommand
from expenditure.models import Expenditure

class Command(BaseCommand):
    help = 'Fetch data from Eurostat API and save to database'

    def handle(self, *args, **kwargs):
        url = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tsc00001?format=JSON&unit=PC_GDP&sectperf=TOTAL&sectperf=BES&sectperf=GOV&sectperf=HES&sectperf=PNP&lang=en"
        response = requests.get(url)
        data = response.json()

        countries_to_exclude = ['EA19', 'EA20', 'EU27_2020']

        # Clear existing data
        Expenditure.objects.all().delete()

        index_mapping = data['dimension']['geo']['category']['index']
        sector_mapping = data['dimension']['sectperf']['category']['index']
        year_mapping = data['dimension']['time']['category']['index']

        total_records = len(data['value'])
        processed_records = 0
        missing_data_records = 0
        missing_data_summary = {}

        for record_key, record_value in data['value'].items():
            try:
                record_index = int(record_key)
                sector_index = record_index % len(sector_mapping)
                country_index = (record_index // len(sector_mapping)) % len(index_mapping)
                year_index = record_index // (len(sector_mapping) * len(index_mapping))

                country = list(index_mapping.keys())[country_index]
                if country in countries_to_exclude:
                    continue

                sector = list(sector_mapping.keys())[sector_index]
                year = list(year_mapping.keys())[year_index]
                percentage_of_gdp = record_value

                if country and sector and year and percentage_of_gdp is not None:
                    Expenditure.objects.create(
                        country=country,
                        sector=sector,
                        year=int(year),
                        percentage_of_gdp=percentage_of_gdp
                    )
                    processed_records += 1
                else:
                    missing_data_records += 1
                    missing_data_summary[record_key] = {
                        'country': country,
                        'sector': sector,
                        'year': year,
                        'value': percentage_of_gdp
                    }
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Error processing record {record_key}: {str(e)}"))

            if processed_records % 100 == 0:
                self.stdout.write(f"Processed {processed_records}/{total_records} records")

        self.stdout.write(self.style.SUCCESS(f'Data fetched and updated successfully. Processed {processed_records}/{total_records} records'))
        self.stdout.write(f'Missing data for {missing_data_records} records')
        
        if missing_data_records > 0:
            self.stdout.write("Summary of missing data:")
            for key, value in missing_data_summary.items():
                self.stdout.write(f"Record {key}: {value}")
