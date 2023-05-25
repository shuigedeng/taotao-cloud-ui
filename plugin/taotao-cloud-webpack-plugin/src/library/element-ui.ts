import { readFileSync } from "node:fs";

import { toPascalCase } from "../utils/utils";

interface SpecialTypes {
  [K: string]: {
    use?: string;
    prototype: {
      [P: string]: string;
    };
  };
}

export const specialComponents: SpecialTypes = {
  Loading: {
    use: "Loading.directive",
    prototype: {
      loading: "Loading.service",
    },
  },
  MessageBox: {
    prototype: {
      msgbox: "MessageBox",
      alert: "MessageBox.alert",
      confirm: "MessageBox.confirm",
      prompt: "MessageBox.prompt",
    },
  },
  Notification: {
    prototype: {
      notify: "Notification",
    },
  },
  Message: {
    prototype: {
      message: "Message",
    },
  },
};

export const scanComponents = (file: string) => {
  const vueComponents = new Set<string>();
  const fileContent = readFileSync(file, "utf-8");

  const componentRegex = /<(?:el-|El)([^>\s]+)(?=[\s>])/g;
  const directiveRegex = /\bv-loading(?::[^=>\s]+)?/g;
  const propertyRegex = /\$(?:msgbox|alert|confirm|prompt|notify|message)/g;

  const componentMatches = fileContent.matchAll(componentRegex);
  for (const match of componentMatches) {
    const componentName = match[1];
    const importedComponent = toPascalCase(componentName);
    vueComponents.add(importedComponent);
  }

  const directiveMatches = fileContent.match(directiveRegex);
  if (directiveMatches?.length) vueComponents.add("Loading");

  const propertyMatches = fileContent.matchAll(propertyRegex);
  for (const match of propertyMatches) {
    const propertyName = match[0].substring(1);
    if (
      propertyName === "msgbox" ||
      propertyName === "alert" ||
      propertyName === "confirm" ||
      propertyName === "prompt"
    ) {
      vueComponents.add("MessageBox");
    } else if (propertyName === "notify") {
      vueComponents.add("Notification");
    } else if (propertyName === "message") {
      vueComponents.add("Message");
    }
  }
  return vueComponents;
};

const handleSpecialComponents = (component: string) => {
  const componentConfig = specialComponents[component];
  if (!componentConfig) {
    return `Vue.use(${component})`;
  }

  const { use, prototype } = componentConfig;

  const importStatements = [];
  if (use) {
    importStatements.push(`Vue.use(${use});`);
  }

  if (prototype) {
    const prototypeStatements = Object.entries(prototype).map(
      ([key, value]) => `Vue.prototype.$${key} = ${value};`
    );
    importStatements.push(...prototypeStatements);
  }

  return importStatements.join("\n");
};

export const setGeneratorContent = (vueComponents: Set<string>) => {
  const importStatement = `import { ${Array.from(
    vueComponents
  ).join()} } from "element-ui"`;

  const componentsList = Array.from(vueComponents).map(handleSpecialComponents);

  let fileContent = `
    ${importStatement}
    import Vue from "vue"
    
    // 全局按需导入的组件列表
    ${componentsList.join("\n")}
  `;

  return fileContent;
};
