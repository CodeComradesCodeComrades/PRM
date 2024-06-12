<script>
  import { writable } from 'svelte/store';

  export let contacts = [];
  export let content = '';
  export let placeholder = '';
  export let submitState = '';

  const inputValue = writable('');
  const suggestions = writable([]);
  const showSuggestions = writable(false);
  const selectedContactIds = writable([]);
  const highlightedIndex = writable(-1);
  const renderedText = writable('');
  const backendText = writable('');

  let editableDiv;
  let hiddenInputElement;

  $: inputValue.set(content); // Initialize inputValue with the content prop

  function handleInput(event) {
    const value = editableDiv.innerHTML;
    inputValue.set(value);

    const match = value.match(/@(\w*)$/);
    if (match) {
      const query = match[1].toLowerCase();
      const filteredContacts = contacts.filter(
        (contact) => contact.name.toLowerCase().startsWith(query) || contact.lastname.toLowerCase().startsWith(query),
      );
      suggestions.set(filteredContacts);
      highlightedIndex.set(-1);
      showSuggestions.set(true);
    } else {
      showSuggestions.set(false);
    }

    updateSelectedContactIds(value);
    updateRenderedText(value);
    updateBackendText(value);
  }

  function selectSuggestion(contact) {
    inputValue.update((value) => {
      const lastAtIndex = value.lastIndexOf('@');
      const newValue =
        value.slice(0, lastAtIndex) +
        `<span contenteditable="false" class="mention-span">@${contact.name} ${contact.lastname}</span>&nbsp;`;
      editableDiv.innerHTML = newValue;
      renderedText.set(newValue);
      updateBackendText(newValue);
      setCursorToEnd(editableDiv);
      return newValue;
    });
    selectedContactIds.update((ids) => [...ids, contact.id]);
    hiddenInputElement.value = $selectedContactIds.join(',');
    showSuggestions.set(false);
  }

  function handleKeyDown(event) {
    if ($showSuggestions) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        highlightedIndex.update((n) => (n + 1) % $suggestions.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        highlightedIndex.update((n) => (n - 1 + $suggestions.length) % $suggestions.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if ($highlightedIndex >= 0) {
          selectSuggestion($suggestions[$highlightedIndex]);
        } else if ($suggestions.length > 0) {
          selectSuggestion($suggestions[0]);
        }
      }
    }
  }

  function setCursorToEnd(element) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function parseText(text) {
    const parts = [];
    const mentionRegex = /@\w+ \w+/g;
    let match;
    let lastIndex = 0;

    while ((match = mentionRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), isMention: false });
      }
      parts.push({ text: match[0], isMention: true });
      lastIndex = mentionRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isMention: false });
    }

    return parts;
  }

  function updateSelectedContactIds(value) {
    const mentionRegex = /@(\w+ \w+)/g;
    let match;
    const mentionedNames = [];

    while ((match = mentionRegex.exec(value)) !== null) {
      mentionedNames.push(match[1]);
    }

    selectedContactIds.update((ids) => {
      const newIds = ids.filter((id) => {
        const contact = contacts.find((contact) => contact.id === id);
        if (contact) {
          const fullName = `${contact.name} ${contact.lastname}`;
          return mentionedNames.includes(fullName);
        }
        return false;
      });
      hiddenInputElement.value = newIds.join(',');
      return newIds;
    });
  }

  function updateRenderedText(value) {
    renderedText.set(value);
  }

  function updateBackendText(value) {
    let text = value;
    contacts.forEach((contact) => {
      const fullName = `${contact.name} ${contact.lastname}`;
      const mentionText = `<span contenteditable="false" class="mention-span">@${fullName}</span>`;
      if (text.includes(mentionText)) {
        text = text.replace(new RegExp(mentionText, 'g'), `<@${contact.id}>`);
      }
    });
    backendText.set(text);
  }
</script>

<div>
  <div
    bind:this={editableDiv}
    contenteditable="true"
    on:input={handleInput}
    on:keydown={handleKeyDown}
    class="editable-div {submitState == 'no_content' ? 'red-outline' : ''}"
    {placeholder}
  >
    {@html content}
  </div>
  <input bind:this={hiddenInputElement} type="hidden" />
  {#if $showSuggestions}
    <div class="bg-gray-800 suggestions">
      {#each $suggestions as contact, index}
        <div
          class="suggestion {index === $highlightedIndex ? 'highlighted' : ''}"
          on:click={() => selectSuggestion(contact)}
        >
          {`${contact.name} ${contact.lastname}`}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .suggestions {
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
  }

  .suggestion {
    padding: 8px;
    cursor: pointer;
  }

  .suggestion:hover,
  .highlighted {
    background-color: #eee;
  }

  .mention {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }

  .mention-span {
    display: inline-block;
    border: 1px solid blue;
    padding: 2px 4px;
    border-radius: 4px;
    background-color: #e0f7ff;
    margin-right: 4px;
  }

  .editable-div {
    border: 1px solid #ccc;
    padding: 10px;
    min-height: 100px;
    width: 100%;
  }
</style>
