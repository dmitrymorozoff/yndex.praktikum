// language=hbs
export default `
<div class="profileContainer">
  <div class="profileContainer__navBack">
    {{> backToButton}}
  </div>
  <div class="profileContainer__main">
    <div class="profileImage"></div>
    <div class="profileName">{{profileName}}</div>
    <form name="profileForm" class="profileForm" onsubmit="return false">
      {{> emailInputField}}
      {{> loginInputField}}
      {{> nameInputField}}
      {{> surnameInputField}}
      {{> visibleNameInputField}}
      {{> phoneInputField}}
    </form>
    <div class="profileConfigs">
      {{> changeUserSettingsText}}
      {{> changePasswordText}}
      {{> logoutText}}
    </div>
  </div>
</div>
`;
