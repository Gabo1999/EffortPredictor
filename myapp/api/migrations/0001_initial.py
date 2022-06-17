# Generated by Django 4.0.4 on 2022-05-30 06:03

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Story',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('issue_key', models.TextField()),
                ('severity', models.CharField(max_length=10)),
                ('priority', models.CharField(max_length=10)),
                ('summary', models.TextField()),
                ('description', models.TextField()),
                ('days_of_work', models.FloatField()),
            ],
        ),
    ]