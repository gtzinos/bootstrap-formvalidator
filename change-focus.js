
/*
  On focus change
  hide other tooltips
*/
$("gt-input-group").on("focusout",function() {
  $("[data-toggle='tooltip']").tooltip("hide");
});

/*
  When a modal box will open
*/
$('.modal').on('shown.bs.modal', function() {
    /*
      Focus the first input element
      from the modal form
      *We need this to call focus event
      to check the fields
    */
    $('.modal').find("form:not(.filter) :input:visible:enabled:first").focus();
    $('.modal').find(".form-control").each(function() {
      validate($(this));
    });
});

/*
  When a modal box will close
  we must focus something
  if we have a form
  *We need this to call focus event
  to check the fields
*/
$('.modal').on('hidden.bs.modal', function() {
  /*
    If we have a form back
    of this modal
  */
   if($(document).find("form:not(.filter) :input:visible:enabled:first"))
   {
     /*
       Focus the first input element
       if we have a page form
     */
     $(document).find("form:not(.filter) :input:visible:enabled:first").focus();
     $(".form-control").each(function() {
       validate($(this));
     });
   }
});

function validate(item)
{
  /*
    Initialize variables (Form, div(gt-input-group), button(submit form), span(icon error,success))
  */
  var first_time = false,
  form = $(item).closest('form'), //form variable
  group = $(item).closest('.gt-input-group'), //div gt-input-group
  input = group.find('> * > .form-control, > .form-control');
  /*
    Find submit button
  */
  var button;
  /*
    Search button from the form
  */
  if(form.find("> * > .gt-submit, > .gt-submit, > * > input[type='submit'], > input[type='submit'], > * > [type='button'], > [type='button'], > * > button, > button").length > 0)
  {
    button = form.find("> * > .gt-submit, > .gt-submit, > * > input[type='submit'], > input[type='submit'], > * > [type='button'], > [type='button'], > * > button, > button");
    /*
      If we can find a button with attribute name = form.name
    */
    if(button.filter("[form='" + form.prop("id") + "']").length)
    {
      button = button.filter("[form='" + form.prop("id") + "']");
    }
  }
  /*
    Search button from the whole document
  */
  else if($(document).find(".gt-submit,input[type='submit'],[type='button'],button").filter("[form='" + form.prop("id") + "']").length > 0)
  {
    button = $(document).find(".gt-submit,input[type='submit'],[type='button'],button").filter("[form='" + form.prop("id") + "']");
  }
  /*
    If something go wrong
  */
  else {
    button = form.find(".gt-submit:first"); //submit button (use document cause this cant find it)
  }

  var icon = group.find('> * > span.gt-icon, > span.gt-icon'), //icon (success,error)
  state = false; //default state
  if(!input.attr("data-placement"))
  {
      input.attr("data-placement","top");
  }
  /*
    If is a list
    and selected index was the default one
  */
  if(group.data('validate') == "select")
  {
    if($(item).find("option:selected").prop('disabled'))
    {
      first_time = true;
    }
  }
  /*
    If no value then return
    This is for first time
  */
  else if(!$(item).val())
  {
    first_time = true;
  }
  /*
    If is a check box and is not checked
  */
  else if(!$(item).prop('checked'))
  {
    /*
      TODO SOMETHING LIKE
      first_time = true
    */
  }


  /*
    If group div dont have attribute validate-date="something"
    then we need to have text length >= 1
  */
  if (!group.data('validate') && !first_time) {
    state = $(item).val() ? true : false;
  }
  /*
    Else If group div have attribute validate-date="email"
    then we need a correct email address
  */
  else if (group.data('validate') == "email" && !first_time)
  {
    state = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($(item).val())
  }
  /*
    Else If group div have attribute validate-date="password"
    then we need a correct password
    1 letter (a-z or A-Z)
    1 Number (0-9)
    1 symbol (#,! . . .)
    8 at least characters
  */
  else if(group.data('validate') == "password" && !first_time)
  {
    state = /[0-9]/.test($(item).val());
    if(state)
    {
      state = /[\'£!$%@#~,=_+¬-]/.test($(item).val());
    }
    if(state)
    {
      state = /[A-Z,a-z]/.test($(item).val());
    }
    if(state)
    {
      /*
        If group div have attribute validate-length="e.g 9"
      */
      if(group.data('length'))
      {
        state = $(item).val().length >= group.data('length') ? true : false;
      }
      /*
        else group div dont have attribute
        validate-length we set a default min = 8
      */
      else {
        state = $(item).val().length >= 8 ? true : false;
      }
    }
  }
  /*
    Else If group div have attribute validate-date="phone"
    then we need a correct phone number
  */
  else if(group.data('validate') == 'phone' && !first_time) {
    state = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test($(item).val())
  }
  /*
    Else If group div have attribute validate-date="length"
    then we need the correct length.
    so we check if text.length >= attribute data-length="e.g 5"
  */
  else if (group.data('validate') == "length" && !first_time)
  {
    state = $(item).val().length >= group.data('length') ? true : false;
  }
  /*
    Else If group div have attribute validate-date="accept-checkbox"
    then we need accept the box
  */
  else if(group.data('validate') == "accept-checkbox" && !first_time)
  {
    state = $(item).prop('checked') ? true : false;
  }
  /*
    Else If group div have attribute validate-date="select"
    then we need the user to select another option
    from default one
  */
  else if(group.data('validate') == "select" && !first_time)
  {
    state = $(item).find("option:selected").prop('disabled') ? false : true;
  }
  /*
    Else If group div have attribute validate-date="number"
    then we need a correct number (1,2,3.5) float type
  */
  else if (group.data('validate') == "number" && !first_time) {
    state = !isNaN(parseFloat($(item).val())) && isFinite($(item).val());
  }
  /*
    If group div have attribute data-equal="#field-id"
    then we need to compare them
  */
  if(group.data('equal') && state && !first_time)
  {
    state = $(item).val().localeCompare($(document).find('#'+group.data('equal')).val()) == 0 ? true : false;
  }
  /*
    If group div have attribute data-not-equal="#field-id"
    then we need to compare them
  */
  if(group.data('not-equal') && state && !first_time)
  {
    state = $(item).val().localeCompare($(document).find('#'+group.data('not-equal')).val()) != 0 ? true : false;
  }
  /*
    If have a required checkbox
  */
  if(group.data('required-checkbox') && !first_time)
  {
    if(!$(group.data('required-checkbox')).prop("checked"))
    {
      first_time = true;
    }
  }

  /*
    If it was the first time
    or no value to check
  */
  if(first_time)
  {
    group.removeClass('has-error');
    group.removeClass('has-success');
    icon.removeClass('glyphicon glyphicon-ok form-control-feedback');
    icon.removeClass('glyphicon glyphicon-remove form-control-feedback');
  }
  /*
    If state was true
    then add a success class icon
  */
  else if (state)
  {
      group.removeClass('has-error');
      icon.removeClass('glyphicon glyphicon-remove form-control-feedback');
      /*
        If have a tooltip attribute
      */
      if(input.attr("data-toggle") && input.attr("data-toggle") == "tooltip")
      {
        input.tooltip('destroy')
              .removeAttr("data-original-title");
      }
      group.addClass('has-success');
      icon.addClass('glyphicon glyphicon-ok form-control-feedback');
  }
  /*
    Else if state was false
    then add an error class icon
  */
  else if(!state){
      /*
        Remove success class (error-icon)
      */
      group.removeClass('has-success');
      icon.removeClass('glyphicon glyphicon-ok form-control-feedback');
      /*
        If have a tooltip attribute
      */
      if(input.attr("data-toggle") && input.attr("data-toggle") == "tooltip")
      {
        /*
          If attr gt-error-message not initialized
        */
        if(!input.attr("gt-error-message")) input.attr("gt-error-message","Wrong input value.");
        /*
          Else gt-error-message initialized
        */
        else input.attr("data-original-title",input.attr("gt-error-message"));
      }
      /*
        If tooltip is hidden
      */
      input.tooltip('show');
      /*
        Add error class (error-icon)
      */
      group.addClass('has-error');
      /*
        Add error icon
      */
      icon.addClass('glyphicon glyphicon-remove form-control-feedback');
  }
  /*
    If user complete successfull the form
    then add button property to enabled
  */
  if (form.find('> * > .gt-input-group.has-success [required], > .gt-input-group.has-success').length >= form.find(' > * > .gt-input-group [required], > .gt-input-group [required]').length && form.find('> * > .gt-input-group.has-error, > .gt-input-group.has-error').length == 0) {
      button.prop('disabled', false);
  }
  /*
    Else If user didnt complete successfull the form
    then add button property to disabled
  */
  else{
      button.prop('disabled', true);
  }
}


/*
  Focus the first input element
  from the document form
  *We need this to call focus event
  to check the fields
*/
$(document).find("form:not(.filter) :input:visible:enabled:first").focus();
$(".form-control").each(function() {
  validate($(this));
});
