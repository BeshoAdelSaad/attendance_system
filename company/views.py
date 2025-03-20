from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import WorkLocation, Company
from .forms import WorkLocationForm
from django.contrib.auth import get_user_model
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from .forms import CompanyForm  # سننشئ هذا النموذج لاحقًا

User = get_user_model()

@login_required
@staff_member_required  # يسمح فقط للأدمن بالدخول
def company_list(request):
    companies = Company.objects.all()
    return render(request, 'admin/company_list.html', {"companies": companies})


@login_required
@staff_member_required
def add_company(request):
    if request.method == "POST":
        form = CompanyForm(request.POST)
        if form.is_valid():
            company = form.save(commit=False)
            company.role = "company"
            company.save()
            return redirect('company_list')
    else:
        form = CompanyForm()

    return render(request, 'admin/add_company.html', {"form": form})


@login_required
@staff_member_required
def edit_company(request, company_id):
    company = get_object_or_404(Company, id=company_id)

    if request.method == "POST":
        form = CompanyForm(request.POST, instance=company)
        if form.is_valid():
            company = form.save()
            return redirect('company_list')
    else:
        form = CompanyForm(instance=company)

    return render(request, 'admin/edit_company.html', {"form": form})


@login_required
@staff_member_required
def delete_company(request, company_id):
    company = get_object_or_404(Company, id=company_id)
    if request.method == "POST":
        company.delete()
        return redirect('company_list')

    return render(request, 'admin/delete_company.html', {"company": company})


def company (request):
    context = {
        'title': 'Company',

    }
    return render(request, 'company/index.html',context)



@login_required
def add_location(request):
    if request.user.role != 'company':
        return redirect('home')  # تأكد أن المستخدم شركة فقط

    if request.method == 'POST':
        form = WorkLocationForm(request.POST)
        if form.is_valid():
            location = form.save(commit=False)
            location.company_id = request.user.company_id  # ربط الموقع بالشركة الحالية
            location.save()
            return redirect('company_locations')  # عرض جميع المواقع بعد الحفظ
    else:
        form = WorkLocationForm()

    return render(request, 'company/work_location/create.html', {'form': form})


@login_required
def company_locations(request):
    if request.user.role != 'company':
        return redirect('home')

    locations = WorkLocation.objects.filter(company_id=request.user.company_id)
    return render(request, 'company/locations_list.html', {'locations': locations})


