from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0086_seed_default_ontology'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='note',
            field=models.TextField(
                blank=True,
                default='',
                help_text='Free-form note about this document, written in Markdown.',
                verbose_name='Note',
            ),
        ),
        migrations.AddField(
            model_name='documentpart',
            name='note',
            field=models.TextField(
                blank=True,
                default='',
                help_text='Free-form note about this image, written in Markdown.',
                verbose_name='Note',
            ),
        ),
    ]
