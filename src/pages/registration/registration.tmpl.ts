// language=hbs
export default `
<div class="container">
  <form name="registrationForm" class="registrationForm" onsubmit="return false">
    <div>
      <p class="form__header">Registration</p>
      {{> emailInputFieldReg }}
      {{> loginInputFieldReg }}
      {{> nameInputFieldReg }}
      {{> surnameInputFieldReg }}
      {{> phoneInputFieldReg }}
      {{> passwordInputFieldReg }}
      {{> passwordAgainInputFieldReg }}
    </div>
    <div class="formBottom">
      {{> completeRegistration}}
      {{> linkToSignIn}}
    </div>
  </form>  
</div>
`;
