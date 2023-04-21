$(document).ready(function () {

   // Ocultar todos los paneles excepto el primero al cargar la página
   $(".step:not(:first)").hide();

   // Mostrar el primer paso al cargar la página
   mostrarBotonesFooter(1);

   // Mostrar/ocultar botones de navegación en el footer según el paso actual
   function mostrarBotonesFooter(paso) {
      switch (paso) {
         case 1:
            $("#register-form__buttons .btn-prev").hide();
            $("#register-form__buttons .btn-next").show();
            $("#register-form__buttons .btn-submit").hide();
            break;
         case 4:
            // TyC
            $("#register-form__buttons .btn-prev").show();
            $("#register-form__buttons .btn-next").hide();
            $("#register-form__buttons .btn-submit").show();
            break;
         case 5:
            // Ajax
            $("#register-form__buttons .btn-prev").hide();
            $("#register-form__buttons .btn-next").hide();
            $("#register-form__buttons .btn-submit").hide();
            break;
         default:
            $("#register-form__buttons .btn-prev").show();
            $("#register-form__buttons .btn-next").show();
            $("#register-form__buttons .btn-submit").hide();
            break;
      }
   }

   // Maneja de eventos para el botón de siguiente
   $("#register-form__buttons .btn-next").on("click", function () {
      var currentStep = $(".step:visible");
      var nextStep = currentStep.next(".step");
      if (validateAndNext(currentStep.data("step"))) {
         currentStep.hide();
         nextStep.fadeIn('fast');
         mostrarBotonesFooter(nextStep.data("step"));

         //Lo correcto sería que actualice con cada clic al botón siguiente, pero bueno, los agrego todos antes de pasar
         if (nextStep.data("step") == 3) {
            updateConfirmationFields();
         }
      }


   });

   // Maneja eventos para el botón de anterior
   $("#register-form__buttons .btn-prev").on("click", function () {
      var currentStep = $(".step:visible");
      var prevStep = currentStep.prev(".step");
      currentStep.hide();
      prevStep.fadeIn('fast');
      mostrarBotonesFooter(prevStep.data("step"));
   });

   // Maneja de eventos para el botón submit
   $("#register-form__buttons .btn-submit").on("click", function () {
      var currentStep = $(".step:visible");
      var nextStep = currentStep.next(".step");
      if (validateAndNext(currentStep.data("step"))) {
         currentStep.hide();
         nextStep.fadeIn('fast');
         mostrarBotonesFooter(nextStep.data("step"));

         const fullName = $('#floatingName').val() + ' ' + $('#floatingSurname').val();
         $.ajax({
            url: 'https://reqres.in/api/users',
            type: 'POST',
            data: {
               name: fullName,
               job: 'web designer',
            },
            success: function (response) {
               $('#ajaxText').html("Se ha creado con éxito la cuenta de <strong>" + response.name + "</strong> con id <strong>" + response.id + "</strong> el <strong>" + response.createdAt + "</strong>");
               $('#ajaxText').fadeIn('slow');
               $('#ajaxCheck').fadeIn('slow');
            },
         });
      }
   });

   $("#btn-export").click(function () {
      const divElement = $("#step3").get(0);
      const pdf = new jsPDF();
      pdf.fromHTML(divElement, 15, 15, {
         'width': 170
      });
      pdf.save("resumen.pdf");
   });


   // Valida los campos
   function validateAndNext(step) {
      var isValid = true;

      if (step === 1) {
         var nombre = $('#floatingName').val();
         var apellido = $('#floatingSurname').val();
         var email = $('#floatingEmail').val();

         // Kinda fold con isValid, validateField devuelve bool y también agrega y quita clases
         isValid = validateField('floatingName', !isEmpty(nombre) && isTextOnly(nombre)) && isValid;
         isValid = validateField('floatingSurname', !isEmpty(apellido) && isTextOnly(apellido)) && isValid;
         isValid = validateField('floatingEmail', !isEmpty(email) && validateEmail(email)) && isValid;
         isValid = validatePassword($('#floatingPassword'), $('#floatingConfirmPassword')) && isValid;

      } else if (step == 2) {
         var dia = $('#floatingDay').val();
         var mes = $('#floatingMonth').val();
         var anio = $('#floatingYear').val();
         var genero = $("#select-gender").val();

         isValid = validateDateField('floatingDay', 1, 31) && isValid;
         isValid = validateDateField('floatingMonth', 1, 12) && isValid;
         isValid = validateDateField('floatingYear', 1900, 2010) && isValid;
         isValid = validateSelect('select-gender') && isValid;

      } else if (step == 4) {
         isValid = validateField('agreeTerms', $('#agreeTerms').is(":checked"));
      }

      return isValid;
   }

   function isEmpty(text) {
      return text == '';
   }

   function isTextOnly(text) {
      var hasNumbers = /\d/.test(text);
      return !hasNumbers;
   }

   function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
   }

   // Función para validar campos, dado nombre de ID y Bool, agrega y quita clases según corresponda
   // Además retorna si cumple la validación o no
   function validateField(id, boolean) {
      var field = $("#" + id);

      if (boolean) {
         field.addClass('is-valid');
         field.removeClass('is-invalid');
         return true;
      } else {
         field.addClass('is-invalid');
         field.removeClass('is-valid');
         return false;
      }
   }

   function validateDateField(id, min, max) {
      var field = $("#" + id);
      var value = field.val();

      if (value < min || value > max || isNaN(value)) {
         field.addClass('is-invalid');
         field.removeClass('is-valid');
         return false;
      } else {
         field.addClass('is-valid');
         field.removeClass('is-invalid');
         return true;
      }
   }

   // Función para validar contraseña y su confirmación
   function validatePassword(password, confirmPassword) {

      // Bien podrían ser una línea
      var isValid = password.val().length >= 6 && password.val() != '';
      isValid = isValid && password.val() == confirmPassword.val();

      if (isValid) {
         password.addClass('is-valid');
         confirmPassword.addClass('is-valid');
         password.removeClass('is-invalid');
         confirmPassword.removeClass('is-invalid');
      } else {
         password.addClass('is-invalid');
         confirmPassword.addClass('is-invalid');
         password.removeClass('is-valid');
         confirmPassword.removeClass('is-valid');
      }
      return isValid;
   }

   // Función para validar campo de género
   function validateSelect(id) {
      var field = $("#" + id);

      if (!field.val()) {
         field.addClass('is-invalid');
         field.removeClass('is-valid');
         return false;
      } else {
         field.addClass('is-valid');
         field.removeClass('is-invalid');
         return true;
      }
   }

   function updateConfirmationFields() {
      var nombre = $('#floatingName').val();
      var apellido = $('#floatingSurname').val();
      var genero = $("#select-gender").val();
      var email = $('#floatingEmail').val();

      var fechaNacimiento = new Date($('#floatingYear').val(), $('#floatingMonth').val() - 1, $('#floatingDay').val());

      var fechaConFormato = fechaNacimiento.toLocaleDateString('es-ES', {
         day: 'numeric',
         month: 'long',
         year: 'numeric'
      });

      $('#confirmName').text(nombre);
      $('#confirmSurname').text(apellido);
      $('#confirmBirthdate').text(fechaConFormato);
      $('#confirmGender').text(genero);
      $('#confirmEmail').text(email);
   }

});