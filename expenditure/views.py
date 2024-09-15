from rest_framework import viewsets
from .models import Expenditure
from .serializers import ExpenditureSerializer

class ExpenditureViewSet(viewsets.ModelViewSet):
    queryset = Expenditure.objects.all()
    serializer_class = ExpenditureSerializer
