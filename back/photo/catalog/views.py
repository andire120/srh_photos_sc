from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from .models import Photo
from .forms import PhotoForm

def photo_list(request):
    photos = Photo.objects.all().order_by('-created_at')
    return render(request, 'photos/photo_list.html', {'photos': photos})

def photo_detail(request, pk):
    photo = get_object_or_404(Photo, pk=pk)
    return render(request, 'photos/photo_detail.html', {'photo': photo})

def photo_create(request):
    if request.method == 'POST':
        form = PhotoForm(request.POST, request.FILES)
        if form.is_valid():
            photo = form.save()
            return redirect('photo_detail', pk=photo.id)
    else:
        form = PhotoForm()
    return render(request, 'photos/photo_form.html', {'form': form})

# forms.py
from django import forms
from .models import Photo

class PhotoForm(forms.ModelForm):
    class Meta:
        model = Photo
        fields = ['title', 'image']