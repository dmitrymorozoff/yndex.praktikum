export default `
  <div class="chat-contact {{#if isHighlighted}}chat-contact_highlighted{{/if}}">
    <div class="chat-contact__photo"></div>
    <div class="chat-contact__middleSection">
      <p class="chat-contact__name">{{firstName}} {{secondName}}</p>
      <p class="chat-contact__lastMessage">{{content}}</p>
    </div>
    <div class="chat-contact__spacer"></div>
    <div class="chat-contact__endSection">
      <p class="chat-contact__lastMessageTime">{{time}}</p>
    </div>
  </div>
`;
