import { createRoot } from "react-dom/client";
import ReactModal from "react-modal";
import { useCallback } from "react";

import PageGraphqlProvider from "../../graphql/client";
import { usePageConnection } from "../connection";
import { FindingFormFields } from "../forms_common/finding";
import RichTextEditor from "../rich_text_editor";

function FindingForm() {
    const { provider, status, connected } = usePageConnection({
        model: "finding",
    });

    const generateAI = useCallback(async () => {
        const prompt = window.prompt("Enter a prompt for the finding");
        if (!prompt) return;
        const csrf = document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="))
            ?.split("=")[1];
        const res = await fetch("/reporting/findings/generate_ai/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrf ?? "",
                "Accept": "application/json",
            },
            body: new URLSearchParams({ prompt }),
        });
        if (res.ok) {
            const data = await res.json();
            alert(data.text);
        } else {
            alert("AI generation failed");
        }
    }, []);

    return (
        <FindingFormFields
            provider={provider}
            status={status}
            connected={connected}
            extraBottom={
                <>
                    <div className="form-group col-md-12">
                        <label>Finding Guidance</label>
                        <div>
                            <RichTextEditor
                                connected={connected}
                                provider={provider}
                                fragment={provider.document.getXmlFragment(
                                    "findingGuidance"
                                )}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-secondary mb-3"
                        onClick={generateAI}
                    >
                        Generate with AI
                    </button>
                </>
            }
        />
    );
}

document.addEventListener("DOMContentLoaded", () => {
    ReactModal.setAppElement(
        document.querySelector("div.wrapper") as HTMLElement
    );
    const root = createRoot(document.getElementById("collab-form-container")!);
    root.render(
        <PageGraphqlProvider>
            <FindingForm />
        </PageGraphqlProvider>
    );
});
