# Generated by Django 3.2 on 2021-04-28 05:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SpotifyToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=255, unique=True)),
                ('access_token', models.CharField(max_length=255, unique=True)),
                ('token_type', models.CharField(max_length=255, unique=True)),
                ('refresh_token', models.CharField(max_length=255, unique=True)),
                ('expires_in', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
