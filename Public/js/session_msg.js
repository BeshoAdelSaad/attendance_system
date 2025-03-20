$(document).ready(function(){  
    // Check for msg in session 
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8000/setting/check/session-variable/',
        data: {
            'session_name': 'msg' // اسم المتغير الذي تريد فحصه
        },
        success: function(data){
            if (data.exists) {
                $('.alert-reservation').fadeIn(1000);
                setTimeout(function(){
                    $('.alert-reservation').fadeOut(800);
                },6000)
                // بمجرد استخدام المتغير، قم بحذفه من الجلسة
                $.ajax({
                    type: 'GET',
                    url: 'http://127.0.0.1:8000/setting/delete/session-variable/',
                    data: {
                        'session_name': 'msg' // اسم المتغير الذي تريد حذفه
                    },
                    success: function(data){
                        console.log('تم حذف متغير الجلسة بنجاح.');
                    },
                    error: function(xhr, status, error){
                        console.error('حدث خطأ أثناء محاولة حذف متغير الجلسة:', error);
                    }
                });
            } else {
                console.log('المتغير غير موجود في الجلسة.');
            }
        },
        error: function(xhr, status, error){
            console.error('حدث خطأ أثناء محاولة فحص المتغير في الجلسة:', error);
        }
    });

    // Remove alert_import_error in session        
    $('#remove_msg').on('click',function(){
            $('#alert_import_error').fadeOut(800);
            $.ajax({
                type: 'GET',
                url: 'http://127.0.0.1:8000/setting/delete/session-variable/',
                data: {
                    'session_name': 'alert_import_error' // اسم المتغير الذي تريد حذفه
                },
                success: function(data){
                    console.log('تم حذف متغير الجلسة بنجاح.');
                },
                
            });
        })

        // Check for alert_import_error in session 
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:8000/setting/check/session-variable/',
            data: {
                'session_name': 'alert_import_error' // اسم المتغير الذي تريد فحصه
            },
            success: function(data){
                if (data.exists) {
                    $('#alert_import_error').fadeIn(1000);
                    setTimeout(function(){
                        $('#alert_import_error').fadeOut(800);
                    },60000)
                    $.ajax({
                        type: 'GET',
                        url: 'http://127.0.0.1:8000/setting/delete/session-variable/',
                        data: {
                            'session_name': 'alert_import_error' // اسم المتغير الذي تريد حذفه
                        },
                        success: function(data){
                            console.log('تم حذف متغير الجلسة بنجاح.');
                        },
                        
                    });
                }
            },
            error: function(xhr, status, error){
                console.error('حدث خطأ أثناء محاولة فحص المتغير في الجلسة:', error);
            }
        });


        // تحقق من وجود المتغير في الجلسة باستخدام AJAX
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:8000/setting/check/session-variable/',
            data: {
                'session_name': 'msg_danger' // اسم المتغير الذي تريد فحصه
            },
            success: function(data){
                if (data.exists) {
                    $('#msg_error').fadeIn(1000);
                    setTimeout(function(){
                        $('#msg_error').fadeOut(1000);
                    },6000)
                    // بمجرد استخدام المتغير، قم بحذفه من الجلسة
                    $.ajax({
                        type: 'GET',
                        url: 'http://127.0.0.1:8000/setting/delete/session-variable/',
                        data: {
                            'session_name': 'msg_danger' // اسم المتغير الذي تريد حذفه
                        },
                        success: function(data){
                            console.log('تم حذف متغير الجلسة بنجاح.');
                        },
                        error: function(xhr, status, error){
                            console.error('حدث خطأ أثناء محاولة حذف متغير الجلسة:', error);
                        }
                    });
                } else {
                    console.log('المتغير غير موجود في الجلسة.');
                }
            },
            error: function(xhr, status, error){
                console.error('حدث خطأ أثناء محاولة فحص المتغير في الجلسة:', error);
            }
        });
});

