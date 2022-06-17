"""myapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from django.conf.urls import include

#Views
from myapp.spa import views
from myapp.api import views as api_views

#from django.contrib.auth.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/login/', views.CustomLoginView.as_view(), name="login"),
    path("accounts/logout/", views.CustomLogoutView.as_view(), name="logout"),
    path('calculate/', api_views.CalculateEffort.as_view()),
    path('history/', views.History.as_view(), name="history"),
    path('history/all/', api_views.RequestHistoryEntries.as_view()),
    path('history/<int:entry_id>/', api_views.RequestEntryStories.as_view(), name="stories"),
    path('account/', views.Account.as_view(), name="account"),
    path('account/details/', api_views.RequestUser.as_view()),
    path('accounts/password_change/', views.CustomPasswordChangeView.as_view(), name="password_change"),
    path('accounts/password_change/done/', views.CustomPasswordChangeDoneView.as_view(), name="password_change_done"),
    path('accounts/password_reset/', views.CustomPasswordResetView.as_view(), name='password_reset'),
    path('reset/<uidb64>/<token>/', views.CustomPasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path('accounts/password_reset/done/', views.CustomPasswordResetDoneView.as_view(), name='password_reset_done'),
    path('accounts/reset/done/', views.CustomPasswordResetCompleteView.as_view(), name="password_reset_complete"),
    path("", views.SpaView.as_view(), name="spa"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
