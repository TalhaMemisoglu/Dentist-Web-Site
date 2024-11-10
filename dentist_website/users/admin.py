from django.contrib import admin

from .models import Profile


admin.site.register(Profile)        #Registering the Profile model to the admin panel

#Gotta change the admin name and password inside terminal!
#Temporary superuser : Admin , admin@gmail.com #password: enes4141