# Generated by Django 4.2.9 on 2024-07-21 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Expenditure',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(max_length=50)),
                ('sector', models.CharField(max_length=50)),
                ('year', models.IntegerField()),
                ('percentage_of_gdp', models.FloatField()),
            ],
        ),
    ]
