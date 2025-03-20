
// $(document).ready(function(){



    function def_date(date1, date2){
        date1.setHours(12, 0, 0, 0);
        date2.setHours(12, 0, 0, 0);
        // فارق الزمن بالميلي ثانية
        var timeDifference = date1 - date2;
        // فارق الأيام
        var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysDifference
    }
    
    function addAtrr(idAtrr, msg, idMsg = '#modal-body') {
        $(idAtrr).attr({
            'data-bs-toggle': 'modal',
            'data-bs-target': '#exampleModal'
        });
        $(idMsg).html(msg);
    }
    function clear_el(idAtrr) {
        
        $(idAtrr).attr({
            'data-bs-toggle': '',
            'data-bs-target': ''
        });
        $(idMsg).html('');
    }
    housFees.click(function() {
        addAtrr(this, "Sorry, you can't change or edit the Housing Fees");
        this.click();
    });
    housFees.on({
        focus: function() {
            $(this).blur();
        }
    });

    /* ############### Start Get Student Details: ###################### */
    student_id.on('blur', function(){

        $.ajax({
            url: 'http://127.0.0.1:8000/students/get-student-details',
            method: 'GET',
            data: {'student_id': $(this).val()},
            success: function(data){
                $('#nameInEnglish').val(data.nameInEnglish);
                $('#programme').text(data.programme);
                $('#studentProfile').text(data.student_Profile);
                $('#remainingBalance').text(data.remaining_Balance);
            },
            error: function(){
                let msg = 'This ID not found';
                $('#programme, #remainingBalance, #studentProfile').text(msg);
                $('#nameInEnglish').val(msg);
            }
        });
    });
    /* ############### End Get Student Details: ###################### */

    /* ############### Start Get rate Details: ###################### */
    rate.on('change', function() {
        
        $.ajax({
            url: 'http://127.0.0.1:8000/students/get-rate-amount/',
            method: 'GET',
            data: {'rate_val': $(this).val(), 'location_id':locationId},
            success: function(rate_code){
                if (rate_code.name.includes('monthly') || !rate_code.name.includes('-NT-')) {
                    housFees.attr('disabled', false);
                    discount.attr('disabled', false);
                    checkedIn.attr('disabled', false);
                    checkedOut.val('');
                    checkedOut.attr('disabled', true);
                    noOfNight.val('')
                    noOfNight.attr('disabled', true);
    
                    if(rate_code.name.includes('monthly')){
                        if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                            housFees.val(rate_code.amount - discount.val())
                        }else {
                            housFees.val(rate_code.amount)
                        }
    
                    }else{
                        if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                            if (rate_code.amount.slice(0, 1) === '$') {
                                    housFees.val('$ ' + (rate_code.amount.slice(1) - discount.val()));
                                }else {
                                    housFees.val(rate_code.amount - discount.val())
                                }
                            }else {
                                housFees.val(rate_code.amount)
                            }
                        }    
    
                }else {
                    housFees.attr('disabled', false);
                    discount.attr('disabled', false);
                    checkedIn.attr('disabled', false);
                    checkedOut.attr('disabled', false);
                    noOfNight.attr('disabled', false);
    
                    if(!noOfNight.val() == '') {
                        if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val(rate_code.amount * noOfNight.val() - discount.val())
                            }else {
                                housFees.val(rate_code.amount * noOfNight.val())
                            }
                    }else {
                        if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                            housFees.val(rate_code.amount - discount.val())
                        }else {
                            housFees.val(rate_code.amount)
                        }
                    }
                }

                

            },
            error: function(){
                housFees.val('')
                discount.val(0)
                checkedIn.val('')
                checkedOut.val('')
                noOfNight.val('')
                housFees.attr('disabled', true);
                discount.attr('disabled', true);
                checkedIn.attr('disabled', true);
                checkedOut.attr('disabled', true);
                noOfNight.attr('disabled', true);
            }

        });
    });
    /* ############### End Get rate Details: ###################### */

    /* ############### Start Get discount Details: ###################### */
    discount.on('change', function() {

        var rate_val = rate.val();
            $.ajax({
                url: 'http://127.0.0.1:8000/students/get-rate-amount',
                method: 'GET',
                data: {'rate_val': rate_val, 'location_id':locationId},
                success: function(rate_code){
                    if(validateNumber(discount.val(), rate_code.amount)){
                        console.log(validateNumber(discount.val(), rate_code.amount))
                        var discount_val = Number(discount.val());
                
                        if (rate_code.name.includes('monthly') || !rate_code.name.includes('-NT-')) {
    
                            if(rate_code.name.includes('monthly')){
                                housFees.val(rate_code.amount - discount_val)
                            }else {
                            if (rate_code.amount.slice(0, 1) === '$') {
                                    housFees.val('$ ' + (rate_code.amount.slice(1) - discount_val));
                                }else {
                                    housFees.val(rate_code.amount - discount_val)
                                }
                            }
    
                        }else {
                            if(!noOfNight.val() == '') {
                                housFees.val(rate_code.amount * noOfNight.val() - discount_val)
                            }else {
                                housFees.val(rate_code.amount - discount_val)
                            }
                        }
                    }else{
                        housFees.val(rate_code.amount)
                    }
                }  
            });
        
            
        
    });
    /* ############### End Get discount Details: ###################### */
    
    /* ############### Start Get checkedIn Details: ###################### */

    checkedIn.on('change', function() {
        var rate_val = rate.val();
        $.ajax({
            'url': 'http://127.0.0.1:8000/students/get-rate-amount',
            'method': 'GET',
            'data': {'rate_val': rate_val, 'location_id':locationId},
            success: function(rate_code){
                if(checkedIn.val() == ''){
                    checkedOut.val('');
                    noOfNight.val('');
                    if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                        housFees.val(Number(rate_code.amount) - Number(discount.val()));
                } else {
                    housFees.val(rate_code.amount);
                }
                    addAtrr(checkedIn, "من فضلك اختر تاريخ صالح");
                    checkedIn.click()
                    clear_el(checkedIn)
                }
                var date_in = new Date(checkedIn.val());
                var now = new Date();
                if (def_date(date_in, now) < 0){
                    checkedIn.val('')
                    addAtrr(checkedIn, "هذا التاريخ اقل من تاريخ اليوم");
                    checkedIn.click()
                    clear_el(checkedIn)
                }else{
                    if (!rate_code.name.includes('-NT-')) {
                        if(rate_code.name.includes('monthly')){
                            if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)){
                                housFees.val(rate_code.amount - discount.val())
                            }else {
                                housFees.val(rate_code.amount)
                            }
                        }else{
                            if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                if (rate_code.amount.slice(0, 1) === '$') {
                                        housFees.val('$ ' + (rate_code.amount.slice(1) - discount.val()));
                                    }else {
                                        housFees.val(rate_code.amount - discount.val())
                                    }
                                }else {
                                    housFees.val(rate_code.amount)
                                }
                            }
                    }else {
                        checkedOut.attr('disabled', false);
                        noOfNight.attr('disabled', false);

                        if(noOfNight.val() == '' && checkedOut.val() == ''){
                            if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val(rate_code.amount - discount.val())
                            }else {
                                housFees.val(rate_code.amount)
                            }
                        }else if(checkedOut.val() == '' && noOfNight.val() != ''){
                            var no_of_night = parseInt(noOfNight.val());
                            var date_out = new Date(date_in.getTime() + (no_of_night * 86400000)); // يوم واحد يساوي 86400000 ميلي ثانية
                            var formatted_date_out = date_out.toISOString().slice(0,10); // تنسيق التاريخ إلى "yyyy-MM-dd"
                            checkedOut.val(formatted_date_out);
                        
                            if (discount.val() != ''  && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val((rate_code.amount * no_of_night) - discount.val());
                            } else {
                                housFees.val(rate_code.amount * no_of_night);
                            }
                        }else if(checkedOut.val() != '' && noOfNight.val() == ''){
                            var date_in = new Date(checkedIn.val()).getTime();
                            var date_out = new Date(checkedOut.val()).getTime();
                            let x = (new Date(checkedOut.val()) - new Date(checkedIn.val())) / 86_400_000;
                            if (date_out < date_in) {
                                checkedOut.val('');                                
                                if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                    housFees.val(rate_code.amount - discount.val())
                                }else {
                                    housFees.val(rate_code.amount)
                                }
                            }else {
                                noOfNight.val(x)
                                if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                    housFees.val(rate_code.amount * x - discount.val())
                                }else {
                                    housFees.val(rate_code.amount * x );
                                }
                            }
                        }else if(checkedOut.val() != '' && noOfNight.val() != ''){
                            var no_of_night = parseInt(noOfNight.val());
                            var date_out = new Date(date_in.getTime() + (no_of_night * 86400000)); // 86_400_000 يوم واحد يساوي 86400000 ميلي ثانية
                            var formatted_date_out = date_out.toISOString().slice(0,10); // تنسيق التاريخ إلى "yyyy-MM-dd"
                            checkedOut.val(formatted_date_out);
                        
                            if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val((rate_code.amount * no_of_night) - discount.val());
                            } else {
                                housFees.val(rate_code.amount * no_of_night);
                            }
                        }else {
                            checkedIn.val('');
                            checkedOut.val('');
                            noOfNight.val('');
                            if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val((rate_code.amount * noOfNight.val()) - discount.val());
                            }else {
                                housFees.val(rate_code.amount * noOfNight.val());
                            }
                            addAtrr(checkedIn, "Something went wrong, please try again!");
                            checkedIn.click()
                            clear_el(checkedIn)
                        }
                        
                    }
                }
            }
        });         
    });
    /* ############### End Get checkedIn Details: ###################### */
    
    /* ############### Start Get checkedOut Details: ###################### */
    
    checkedOut.on('change', function() {

        var rate_val = rate.val();
        $.ajax({
            'url': 'http://127.0.0.1:8000/students/get-rate-amount',
            'method': 'GET',
            'data': {'rate_val': rate_val, 'location_id':locationId},
            success: function(rate_code){
                if(checkedOut.val() == ''){
                    checkedIn.val('');
                    noOfNight.val('');
                    if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                        housFees.val(rate_code.amount - discount.val());
                } else {
                    housFees.val(rate_code.amount);
                }
                    addAtrr(checkedOut, "من فضلك اختر تاريخ صالح");
                    checkedOut.click()
                    clear_el(checkedOut)
                }
                var date_out = new Date(checkedOut.val())
                var now = new Date()
                days = def_date(date_out,now)

                if (days < 1){
                    checkedOut.val('');
                    noOfNight.val('');
                    if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                        housFees.val(rate_code.amount - discount.val());
                } else {
                    housFees.val(rate_code.amount);
                }
                    addAtrr(checkedOut, "يجب اختيار تاريخ اكبر من تاريخ الوصول بيوم واحد علي الاقل");
                    checkedOut.click()
                    clear_el(checkedOut)
                }else{

                    if(checkedIn.val() == '' && noOfNight.val() == ''){ 
                        var formatted_date_in = new Date().toISOString().slice(0,10); // تنسيق التاريخ إلى "yyyy-MM-dd"
                        noOfNight.val(days); 
                        checkedIn.val(formatted_date_in);
                        if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val((rate_code.amount * days) - discount.val());
                        } else {
                            housFees.val(rate_code.amount * days);
                        }
                    }else if(checkedIn.val() != '' && noOfNight.val() == ''){
                        days = def_date(date_out, new Date(checkedIn.val()))
                        if(days < 1){
                            checkedOut.val('');
                            noOfNight.val('');
                            if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val(rate_code.amount - discount.val());
                        } else {
                            housFees.val(rate_code.amount);
                        }
                            addAtrr(checkedOut, "هذا التاريخ غير صحيح");
                            checkedOut.click()
                            clear_el(checkedOut)
                        }else{
                            noOfNight.val(days)
                            if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val((rate_code.amount * days) - discount.val());
                            } else {
                                housFees.val(rate_code.amount * days);
                            }
                        }
                        
                    }else if(checkedIn.val() == '' && noOfNight.val() != ''){
                        var date_in_valid = new Date(date_out.getTime() - (noOfNight.val() * 86_400_000))

                        if(def_date(date_in_valid, now) >= 0){
                            var formatted_date_in = date_in_valid.toISOString().slice(0,10); // تنسيق التاريخ إلى "yyyy-MM-dd"

                            checkedIn.val(formatted_date_in);

                            if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val((rate_code.amount * noOfNight.val()) - discount.val());
                            }else {
                                housFees.val(rate_code.amount * noOfNight.val());
                            }
                        }else{
                            checkedOut.val('');
                            checkedOut.val('');
                            addAtrr(checkedOut, "هذا التاريخ غير صحيح");
                            checkedOut.click()
                            clear_el(checkedOut)
                        }
                        
                    }else if(checkedIn.val() != '' && noOfNight.val() != ''){
                        if(def_date( date_out, new Date(checkedIn.val()) ) < 1 ){
                            checkedOut.val('');
                            noOfNight.val('');
                            if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val(rate_code.amount - discount.val());
                        } else {
                            housFees.val(rate_code.amount);
                        }
                            addAtrr(checkedOut, "هذا التاريخ غير صحيح");
                            checkedOut.click()
                            clear_el(checkedOut)
                        }else{
                            noOfNight.val(def_date(date_out, new Date(checkedIn.val())))
                            if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                                housFees.val((rate_code.amount * noOfNight.val()) - discount.val());
                            }else {
                                housFees.val(rate_code.amount * noOfNight.val());
                            }
                        }
                    }else{
                        checkedIn.val('');
                        checkedOut.val('');
                        noOfNight.val('');
                        if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                            housFees.val((rate_code.amount * noOfNight.val()) - discount.val());
                        }else {
                            housFees.val(rate_code.amount * noOfNight.val());
                        }
                        addAtrr(checkedOut, "Something went wrong, please try again!");
                        checkedOut.click()
                        clear_el(checkedOut)
                    }
                }
                
            }
        })
    })
    /* ############### End Get checkedOut Details: ###################### */

    /* ############### Start Get no Of Night Details: ###################### */
    noOfNight.on('change', function() {
        var rate_val = rate.val();
        $.ajax({
            'url': 'http://127.0.0.1:8000/students/get-rate-amount',
            'method': 'GET',
            'data': {'rate_val': rate_val, 'location_id':locationId},
            success: function(rate_code){
                if(checkedIn.val() == '' && checkedOut.val() == ''){
                    checkedIn.val(new Date().toISOString().slice(0, 10))
                    checkedOut.val(new Date(new Date().getTime() + (noOfNight.val() * 86_400_000)).toISOString().slice(0, 10))
                    if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                        housFees.val((rate_code.amount * noOfNight.val()) - discount.val())
                    }else {
                        housFees.val(rate_code.amount * noOfNight.val())
                    }
                }else if((checkedIn.val() != '' && checkedOut.val() == '') || (checkedIn.val() != '' && checkedOut.val() != '')){
                    checkedOut.val(new Date(new Date(checkedIn.val()).getTime() + (noOfNight.val() * 86_400_000)).toISOString().slice(0, 10))
                    if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                        housFees.val((rate_code.amount * noOfNight.val()) - discount.val())
                    }else {
                        housFees.val(rate_code.amount * noOfNight.val())
                    }
                }else if(checkedIn.val() == '' && checkedOut.val() != ''){
                    var checkedOut_date = new Date(new Date(checkedOut.val()).getTime() - (noOfNight.val() * 86_400_000))
                    if(def_date(checkedOut_date, new Date()) <1 ){
                        checkedOut.val('');
                        checkedIn.val('');
                        noOfNight.val('');
                        if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                            housFees.val(rate_code.amount - discount.val());
                    } else {
                        housFees.val(rate_code.amount);
                    }
                        addAtrr(noOfNight, "هذه القيمة غير صحيحة");
                        noOfNight.click()
                        clear_el(noOfNight)
                    }else{
                        checkedIn.val(checkedOut_date.toISOString().slice(0, 10))
                        if(discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                            housFees.val((rate_code.amount * noOfNight.val()) - discount.val())
                        }else {
                            housFees.val(rate_code.amount * noOfNight.val())
                        }
                    }
                }else{
                    checkedIn.val('');
                    checkedOut.val('');
                    noOfNight.val('');
                    if (discount.val() != '' && validateNumber(discount.val(), rate_code.amount)) {
                        housFees.val((rate_code.amount * noOfNight.val()) - discount.val());
                    }else {
                        housFees.val(rate_code.amount * noOfNight.val());
                    }
                    addAtrr(noOfNight, "Something went wrong, please try again!");
                    noOfNight.click()
                    clear_el(noOfNight)
                }
            }
        })
    })

    /* ############### End Get no Of Night Details: ###################### */


        // استماع لتغيير قيمة حقل Room Type
        $('#room_Type').change(function() {
            console.log($('#room_Type').val())
            console.log($(this).val())
            var roomType = $(this).val();
            // إرسال طلب AJAX إلى الخادم
            $.ajax({
                url: 'http://127.0.0.1:8000/students/get-rooms-by-type', // تعديل العنوان حسب روت الخادم
                type: 'GET',
                data: {
                    room_type: roomType,
                    location_id: locationId
                },
                success: function(data) {
                    // تحديث قائمة الغرف بناءً على البيانات التي تم استرجاعها
                    $('#room_No').empty();
                    $('#room_No').append($('<option>', {
                        value:'',
                        text: 'Select Room'
                    }));
                    $.each(data.rooms, function(index, room) {
                        $('#room_No').append($('<option>', {
                            value: room.room_no,
                            text: room.room_no + ' .......... ' + room.room_status + ' => ' + room.beds
                        }));
                    });
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log('Error:', errorThrown);
                }
            });
        });
    
// });
    
