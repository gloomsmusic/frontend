import Component from '@ember/component';
import { inject as service } from '@ember/service';
import BlogPostBodyValidations from '../../validations/blog-post-body';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';

export default Component.extend({
  currentLocale: 'en',
  store: service(),
  flashMessages: service(),
  isSaving: false,
  setCurrentBody(){
    this.set('currentBody',
      this.model.blogPostBodies.filter((body) => {
        return body.language === this.currentLocale
      }).firstObject);
    if(!this.currentBody){
      this.model.save().then((blogPost) => {
        let body = this.store.createRecord('blogPostBody', {
          blogPost: blogPost,
          language: this.currentLocale
        });
        this.set('currentBody', body);
        blogPost.blogPostBodies.pushObject(this.currentBody);
        this.set('bodyChangeset', new Changeset(body, lookupValidator(BlogPostBodyValidations), BlogPostBodyValidations));
      });
    }else{
      this.set('bodyChangeset', new Changeset(this.currentBody, lookupValidator(BlogPostBodyValidations), BlogPostBodyValidations));
    }
  },
  init(){
    this._super(...arguments);
    this.locales = [
      {text: 'English', value: 'en'},
      {text: '日本語', value: 'ja'},
      {text: '한국어', value: 'kr'},
      {text: 'Español', value: 'es'}
    ];
    this.setCurrentBody();
  },
  actions: {
    setLocale(locale){
      this.set('currentLocale', locale);
      this.setCurrentBody();
    },
    save(){
      this.set('isSaving', true);
      this.bodyChangeset.validate().then( () => {
        if(this.bodyChangeset.isValid){
          this.currentBody.save().then(() => {
            console.log('saved blog post body');
            this.set('isSaving', false);
            this.flashMessages.success('Saved blog post!');
          }).catch((error) => {
            console.log(`error: ${error}`);
            this.set('isSaving', false);
            this.flashMessages.danger("Couldn't save blog post!");
          });
        }
      });
    },
    insertImageMarkdown(image){
      const imageMarkdown = `![${image.fileBasename}](${image.s3Url})`;
      let textArea = this.element.querySelector("textarea");
      const currentPosition = textArea.selectionStart;

      const start = textArea.value.substr(0, currentPosition);
      const end = textArea.value.substr(currentPosition);
      textArea.value = start + imageMarkdown + end;
    }
  }
});
