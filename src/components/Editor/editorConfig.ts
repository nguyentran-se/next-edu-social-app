import { userApis } from 'apis';
import dynamic from 'next/dynamic';
import { removeAccents } from 'utils';
// import { Quill } from 'react-quill';
// const Delta = Quill.import('delta');
// const Break = Quill.import('blots/break');
// const Embed = Quill.import('blots/embed');

// const lineBreakMatcher = () => {
//   let newDelta = new Delta();
//   newDelta.insert({ break: '' });
//   return newDelta;
// };
// class SmartBreak extends Break {
//   length() {
//     return 1;
//   }
//   value() {
//     return '\n';
//   }

//   insertInto(parent: any, ref: any) {
//     Embed.prototype.insertInto.call(this, parent, ref);
//   }
// }

// SmartBreak.blotName = 'break';
// SmartBreak.tagName = 'BR';
// Quill.register(SmartBreak);
const atValues = [
  { id: 1, value: 'Fredrik Sundqvist' },
  { id: 2, value: 'Patrik Sjölin' },
];
export const editorConfig = {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
    ],
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@', '#'],
      source: async function (searchTerm: string, renderItem: any, mentionChar: any) {
        let values: any;
        if (
          mentionChar === '@'
          // || mentionChar === '#'
        ) {
          const response = await userApis.getUsers();
          const users = response
            .filter(({ name }) =>
              removeAccents(name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase())),
            )
            .slice(0, 5)
            .map(({ id, name }) => ({ id, value: name }));
          values = users;
        }
        renderItem(values, searchTerm);
      },
    },
    keyboard: {
      bindings: {
        handleEnter: {
          key: 13,
          handler: () => {},
        },
      },
    },
  },
  formats: [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'mention',
  ],
};
export const editorUtils = {
  changeLinkPlaceholder: () => {
    const input = document.querySelector('input[data-link]') as HTMLInputElement;
    const placeholder = 'Paste or type a link ...';
    if (input) {
      input.dataset.link = placeholder;
      input.placeholder = placeholder;
    }
  },
  hideToolbar: () => {
    const toolbar = document.querySelector('.ql-toolbar') as HTMLDivElement;
    if (toolbar) toolbar.style.display = 'none';
  },
  focus: () => {
    const quillEditor = document.querySelector('.quill-editor .ql-editor') as HTMLDivElement;
    if (quillEditor) quillEditor.focus();
  },
};
