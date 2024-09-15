from django.db import models

class Expenditure(models.Model):
    country = models.CharField(max_length=50)
    sector = models.CharField(max_length=50)
    year = models.IntegerField()
    percentage_of_gdp = models.FloatField()

    def __str__(self):
        return f"{self.country} - {self.sector} - {self.year}"
