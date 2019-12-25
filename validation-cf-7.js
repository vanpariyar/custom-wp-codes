jQuery(document).ready(function($){
	
	$(document).find('.wpcf7-form').each(function () {
        var form = $(this);
        var error = $('.alert-danger', form);
        var success = $('.alert-success', form);
       
		$(document).on("click", ".wpcf7-form .wpcf7-form-control", function () {
       		form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                //ignore: [],
                ignore: "",
                rules: {
                    // Personal Information
                    Email: {
                        required: true,
                    },
                    CompanyName: {
                        required: true,
                    },
                    Tellusaboutyourproject: {
                        required: true,
                    },
                },
                messages: {
                    Email: {
                        required: v_messages['v_email']
                    },
                    CompanyName: {
                        required: v_messages['v_company']
                    },
                    Tellusaboutyourproject: {
                        required: v_messages['v_project']
                    },                
                },
                errorPlacement: function (error, element) {
                    if (element.parent(".input-group").size() > 0) {
                        error.insertAfter(element.parent(".input-group"));
                    } else if (element.attr("data-error-container")) {
                        error.appendTo(element.attr("data-error-container"));
                    } else if (element.parents('.radio-list').size() > 0) {
                        error.appendTo(element.parents('.radio-list').attr("data-error-container"));
                    } else if (element.parents('.radio-inline').size() > 0) {
                        error.appendTo(element.parents('.radio-inline').attr("data-error-container"));
                    } else if (element.parents('.checkbox-list').size() > 0) {
                        error.appendTo(element.parents('.checkbox-list').attr("data-error-container"));
                    } else if (element.parents('.checkbox-inline').size() > 0) {
                        error.appendTo(element.parents('.checkbox-inline').attr("data-error-container"));
                    } else if (element.parents('.project-types').size() > 0) {
                        error.insertAfter(element.parents('.project-types'));
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                },
                invalidHandler: function (event, validator) { //display error alert on form submit                    success.hide();
                    error.show();
                    //App.scrollTo(error, - 200);
                },
                highlight: function (element) { // hightlight error inputs
                    $(element)
                            .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                },
                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                            .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },
                success: function (label) {

                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radio buttons, no need to show OK icon
                        label.closest('.form-group').removeClass('has-error').addClass('has-success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                                .addClass('valid') // mark the current input as valid and display OK icon
                                .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    }
                }
            });
        });
    });

	/**
	 *  Code for the popup when it shows 5 minute after resubmitting the same email.	
	 */
	var validUser = false;
	jQuery('.contact-submit').click(function(e){
		var formEmail = $('.wpcf7-email').val();
		if( formEmail.length ) {
			if(localStorage.getItem('emailObj')){
			emailObj = localStorage.getItem('emailObj');
			emailObj = JSON.parse(emailObj);
			}else{
				emailObj = [];
				localStorage.setItem('emailObj', JSON.stringify(emailObj));
			}
			sentEmail = formEmail;
			sentEmail = sentEmail.trim();
			const timeToExpire = 300000 //300000 ( miliseconds )= 5 minutes this is time in mili second Of 5-minute
			var filterdEmail = emailObj.filter( (email) => { 
				return email.value == sentEmail && email.expireAt > new Date().getTime() 
			})
			if(filterdEmail.length == 0){
				emailObj.push( { 
					'expireAt': new Date().getTime() + timeToExpire, 'value': sentEmail 
				});
			} else if(filterdEmail.length == 1){
				if( filterdEmail[0].expireAt > new Date().getTime()){
					emailObj = emailObj.filter( (email) => { return filterdEmail[0].expireAt > new Date().getTime() }  );					e.preventDefault();
					jQuery('#exampleModal').modal();
					createSum();
				}
			} else {
				console.log('multiple');
			}
			// localStorage.setItem('emailObj', JSON.stringify(emailObj));
		}

	});

	createSum();
	jQuery('.quiz-reset').click(createSum);
	jQuery( "#ans" ).keyup(checkInput);
	$('.quiz-submit').on( 'click', () => {
		validUser = true;
		jQuery('#exampleModal').modal();
		if($('.wpcf7-email').length){
		 	var filterdEmail = $('.wpcf7-email').val();
		 	if(localStorage.getItem('emailObj')){
				emailObj = localStorage.getItem('emailObj');
				emailObj = JSON.parse(emailObj);
			}
			else{
				emailObj = [];
				localStorage.setItem('emailObj', JSON.stringify(emailObj));
			}
			if( filterdEmail = filterdEmail.trim() ){
					emailObj = emailObj.filter( (email) => { return email.value != filterdEmail }  );
					localStorage.setItem('emailObj', JSON.stringify(emailObj));
			}

		}
	} );
	
});

// THIS CODE IS BEING USED IN TO GENERATE THE QUIZ
$ = jQuery;

var total;
function getRandom(){return Math.ceil(Math.random()* 20);}
function createSum(){
		var randomNum1 = getRandom(),
			randomNum2 = getRandom();
	total =randomNum1 + randomNum2;
  $( "#question" ).text( randomNum1 + " + " + randomNum2 + "=" );  
  $("#ans").val('');
}

function checkInput(){
	// jQuery('#mail-confirm-btn,#mail-close-btn').hide();
	var input = $("#ans").val(), slideSpeed = 200,
      hasInput = !!input, 
      valid = hasInput && input == total;
    $('#message').toggle(!hasInput);
    $('.quiz-submit').prop('disabled', !valid);  
    $('#success').toggle(valid);
    $('#fail').toggle(hasInput && !valid);
}
$('.quiz-submit').on( 'click', () => {
	 validUser = true;
	 jQuery('#exampleModal').modal();
	 alert(clicked);
} );

jQuery('#mail-confirm-btn').on( 'click', () => {
		jQuery('#mail-confirm-btn,#mail-close-btn').remove();
		jQuery('#quiz').show();
});

jQuery('#quiz .quiz-reset i').on( 'click', () => {
		jQuery('#quiz .quiz-reset i').addClass('spin');
		jQuery('#mail-close-btn').hide();
		setTimeout(function () { 
		    jQuery('#quiz .quiz-reset i').removeClass('spin');
		}, 500);
});

jQuery(document).on('wpcf7mailsent', function (event) {
	if(localStorage.getItem('emailObj')){
		emailObj = localStorage.getItem('emailObj');
		emailObj = JSON.parse(emailObj);
	}else{
		emailObj = [];
		localStorage.setItem('emailObj', JSON.stringify(emailObj));
	}
	const sentEmail = event.detail.inputs[0].value.trim();
	const timeToExpire = 300000 //300000 ( miliseconds )= 5 minutes this is time in mili second Of 5-minute
	var filterdEmail = emailObj.filter( (email) => { 
		return email.value == sentEmail && email.expireAt > new Date().getTime() 
	})
	if(filterdEmail.length == 0){
		emailObj.push( { 
			'expireAt': new Date().getTime() + timeToExpire, 'value': sentEmail 
		});
	} else if(filterdEmail.length == 1){
		if( filterdEmail[0].expireAt > new Date().getTime()){
			emailObj = emailObj.filter( (email) => { return filterdEmail[0].expireAt > new Date().getTime() }  );
			console.log('run');
			jQuery('#exampleModal').modal();
		}
	} else {
		console.log('multiple');
	}
	localStorage.setItem('emailObj', JSON.stringify(emailObj));
	
});