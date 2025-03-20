from django.shortcuts import render, redirect
from django.contrib.sessions.models import Session
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from geopy.distance import geodesic
from company.models import WorkLocation
from employees.models import Employee
from .models import CustomUser
from django.contrib.auth import login, logout, authenticate
from datetime import datetime, timedelta

def login_view(request):
    if request.user.is_authenticated:  
        return redirect('home')
     
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        latitude = request.POST.get("latitude", "0")
        longitude = request.POST.get("longitude", "0")

        try:
            latitude = float(latitude) if latitude else 0.0
            longitude = float(longitude) if longitude else 0.0
        except ValueError:
            return JsonResponse({"error": "Invalid coordinates"}, status=400)

        # 🔹 التحقق مما إذا كان الجهاز قد سجل دخولًا بالفعل اليوم
        last_login_user = request.COOKIES.get("last_employee_login")
        last_login_date = request.COOKIES.get("last_login_date")
        today_date = datetime.today().strftime('%Y-%m-%d')

        if last_login_user and last_login_date == today_date:
            return JsonResponse({"error": "This device has already logged in with another employee today."}, status=403)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # ✅ الموظف → تحقق من الموقع الجغرافي
            if user.role == "employee":
                employee = get_object_or_404(CustomUser, id=user.id)
                locations = WorkLocation.objects.filter(company_id=employee.company_id)

                for location in locations:
                    distance = geodesic((latitude, longitude), (location.latitude, location.longitude)).meters
                    if distance <= location.radius:
                        login(request, user)

                        # 🔹 إنشاء استجابة لتخزين الكوكيز
                        response = JsonResponse({
                            "success": "Login successful",
                            "username": user.username,
                            "redirect": "/employee_dashboard/"
                        })
                        response.set_cookie("last_employee_login", user.id, expires=datetime.now() + timedelta(days=1))
                        response.set_cookie("last_login_date", today_date, expires=datetime.now() + timedelta(days=1))

                        return response  # ⬅️ هنا تأكدنا من إرسال الاستجابة مع الكوكيز

                return JsonResponse({"error": "You are not in a valid work location"}, status=400)


            # ✅ الشركة → تحويل إلى صفحة الشركة
            elif user.role == "company":
                login(request, user)
                return JsonResponse({"success": "Login successful", "username": user.username, "redirect": "/company_dashboard/"})
            
            # ✅ الأدمن → تحويل إلى لوحة التحكم
            elif user.role == "admin":
                login(request, user)
                return redirect('/admin/',{'msg':'not'})

            # ❌ دور غير معروف
            else:
                logout(request)
                return JsonResponse({"error": "Unauthorized role"}, status=403)

        return JsonResponse({"error": "Invalid credentials"}, status=401)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def login_page(request):
    if request.user.is_authenticated:  
        return redirect('home') 
    context = {
        'title': 'Login'
    }
    return render(request, 'accounts/login.html', context)