from django.db import models

# Create your models here.
class Task(models.Model):
    # Definimos las opciones de estado
    STATUS_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('PROCESO', 'En Proceso'),
        ('COMPLETADA', 'Completada'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Cambiamos el BooleanField por un CharField con opciones
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDIENTE',
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.status}"