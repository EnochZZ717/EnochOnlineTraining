Component({
  properties: {
    title: String,
    padding: Boolean,
    card: Boolean,
  },

  externalClasses: ['custom-class'],
  methods: {
    showVideo(obj) {
      console.log('show');
    }
  }
});