export default `
  <div class="chatPageContainer">
    {{> chatsList }}
    {{#if isChatSelected}}
      {{> chat}}
    {{else}}
      <div class="chatWindowNoConversation">
        <span class="chatwindow_no-selected-chat">Choose a chat to send a message</span>
      </div>
    {{/if}}
  </div>
`;
