from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>deneme</h1>")
