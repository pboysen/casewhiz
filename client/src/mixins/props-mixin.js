// needs error checking
export default {
  methods: {
    parse(value) {
      let props = {};
      value
        .substring(1)
        .split(";")
        .forEach(prop => {
          let values = prop.trim().split("=");
          props[values[0]] = values[1].trim();
        });
      return props;
    }
  }
};
