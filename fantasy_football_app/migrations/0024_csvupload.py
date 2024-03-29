# Generated by Django 4.2.9 on 2024-01-13 18:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasy_football_app', '0023_delete_standings'),
    ]

    operations = [
        migrations.CreateModel(
            name='CSVUpload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='csvs/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('week', models.CharField(blank=True, choices=[('WC', 'Wild Card'), ('DIV', 'Divisional'), ('CONF', 'Conference'), ('SB', 'Super Bowl')], max_length=12, null=True)),
            ],
        ),
    ]
