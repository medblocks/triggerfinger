import { LitElement, html, customElement, property } from "lit-element";
import { until } from "lit-html/directives/until";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { process } from "./process";
import "medblocks-ui";
import "@shoelace-style/shoelace/dist/themes/base.css";
import ky from "ky";

const baseTemplateUrl = "http://localhost:5001/ehrbase/rest/ecis";

const getForm = async (templateId) => {
  if (!templateId) {
    return html`No template`;
  }
  const r = await ky.get(`${baseTemplateUrl}/v1/template/${templateId}`);
  const template = await r.json();
  const tree = template.webTemplate.tree;
  const generated = process(tree).snippet;
  const dynamic = unsafeHTML(generated);
  const form = html` <mb-form> ${dynamic} </mb-form> `;
  return form;
};
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("my-element")
export class MyElement extends LitElement {
  @property({ type: String })
  templateId: string = location.hash.replace("#", "");

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <h1>${this.templateId}</h1>
      ${until(getForm(this.templateId), html`loading...`)}
    `;
  }
}
