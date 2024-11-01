export class CustomUpload extends HTMLElement {
  static observedAttributes = ["imagesrc", "filename", "error"];
  input: HTMLInputElement | null;
  img: HTMLImageElement | null;
  filename: any;
  error: any;
  maxSize: string | null;
  mappedAttributes: {
    imagesrc: {
      default: string;
      target: {
        name: HTMLImageElement | null;
        innerHTML: boolean;
        attribute: string;
      };
    };
    filename: { default: string; target: { name: any; innerHTML: boolean } };
    error: { default: string; target: { name: any; innerHTML: boolean } };
  };
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.img = this.querySelector("img");
    this.filename = this.querySelector(".file-name");
    this.error = this.querySelector(".error");
    this.maxSize = this.getAttribute("maxsize");
    this.mappedAttributes = {
      imagesrc: {
        default: "",
        target: {
          name: this.img,
          innerHTML: false,
          attribute: "src",
        },
      },
      filename: {
        default: "",
        target: {
          name: this.filename,
          innerHTML: true,
        },
      },
      error: {
        default: "",
        target: {
          name: this.error,
          innerHTML: true,
        },
      },
    };
  }
  connectedCallback() {
    this.removeAttribute("nojs");
    this.input!.addEventListener("change", (e) => {
      this.setAttribute("error", "");
      //@ts-ignore
      const files = e.target.files;
      const isValid = this.validate(files);
      if (isValid) {
        this.onUpload(files);
      }
    });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.mappedAttributes[name]) {
      const mapped = this.mappedAttributes[name];
      const target = mapped.target.name;

      mapped.target?.innerHTML
        ? (target.innerHTML = newValue)
        : target.setAttribute(mapped.target.attribute, newValue);
    }
  }
  onUpload(files) {
    console.log(files);
    const imageSrc = URL.createObjectURL(files[0]);
    const fileName = files[0].name;
    this.setAttribute("filename", "Uploaded file: " + fileName);
    this.setAttribute("imagesrc", imageSrc);
  }
  validate(files) {
    const file = files[0];
    if (file.size > this.maxSize!) {
      this.setAttribute("error", "File's weight shouldn't exceed 1 MB");
      return false;
    }
    return true;
  }
}
customElements.define("custom-upload", CustomUpload);
