from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Contrato, Avaliacao, Profissional

@receiver(post_save, sender=Contrato)
def atualizar_total_servicos(sender, instance, **kwargs):
    if instance.status == Contrato.CONCLUIDO:
        prof = instance.profissional

        total = Contrato.objects.filter(
            profissional=prof,
            status=Contrato.CONCLUIDO
        ).count()

        prof.total_servicos = total
        prof.save()

@receiver(post_save, sender=Avaliacao)
def atualizar_media_avaliacoes(sender, instance, created, **kwargs):
    if created:
        prof = instance.avaliado.profissional

        todas = Avaliacao.objects.filter(avaliado=instance.avaliado)
        media = sum(a.nota for a in todas) / todas.count()

        prof.avaliacao_media = media
        prof.save()
