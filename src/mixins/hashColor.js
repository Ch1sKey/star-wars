export default {
  methods: {
    getHashColor(str) {
      let hash = 125;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return `hsl(${hash % 360}, 50%, 50%)`;
    },
  },
};
