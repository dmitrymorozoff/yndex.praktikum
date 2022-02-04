export default `
  <div class="chatwindow">
    <div class="chatwindow__header">
      <div class="chatwindow__header_profileimage_small"></div>
      <div class="chatwindow__header_settings"></div>
    </div>
    <div class="conversation">
      {{> messages }}
    </div>
    <form name="conversationForm" id="conversationForm" class="form-conversation" onsubmit="return false">
      <div class="form-conversation__attachment"></div>
      <div class="form-conversation__inputfield">
        {{> messageInputField}}
      </div>
      <div class="form-conversation__submit-msg">
        {{> submitMessageButton }}
      </div>
    </form>
</div>
`;
