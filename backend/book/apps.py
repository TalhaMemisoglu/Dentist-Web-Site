from django.apps import AppConfig


class BookConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'book'
    
    def ready(self):
        import book.signals  # Ensure this is importing the signal module
