<template>
    <EscrModal class="escr-note-modal">
        <template #modal-header>
            <h2 class="escr-note-header">
                {{ title }}
            </h2>
        </template>
        <template #modal-content>
            <EscrTabs
                v-model="tab"
                :tabs="tabs"
            />
            <textarea
                v-if="tab === 'write'"
                ref="editor"
                v-model="text"
                class="escr-note-editor"
                :placeholder="$t('Write a note in Markdown…')"
                spellcheck="false"
                @keydown.ctrl.enter.prevent="save"
                @keydown.meta.enter.prevent="save"
            />
            <div
                v-else
                class="escr-note-preview escr-markdown"
                v-html="rendered"
            />
        </template>
        <template #modal-actions>
            <EscrButton
                color="outline-text"
                :label="$t('Cancel')"
                :on-click="onCancel"
            />
            <EscrButton
                color="primary"
                :label="$t('Save')"
                :disabled="disabled"
                :on-click="save"
            />
        </template>
    </EscrModal>
</template>
<script>
import EscrButton from "../Button/Button.vue";
import EscrModal from "../Modal/Modal.vue";
import EscrTabs from "../Tabs/Tabs.vue";
import renderMarkdown from "../../util/markdown";
import "./NoteModal.css";

export default {
    name: "EscrNoteModal",
    components: {
        EscrButton,
        EscrModal,
        EscrTabs,
    },
    props: {
        /**
         * Whether the save button is disabled (e.g. while a request is in flight).
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * Current Markdown content of the note.
         */
        note: {
            type: String,
            default: "",
        },
        /**
         * Callback fired when the user cancels, without arguments.
         */
        onCancel: {
            type: Function,
            required: true,
        },
        /**
         * Callback fired with the Markdown text when the user saves.
         */
        onSave: {
            type: Function,
            required: true,
        },
        /**
         * Text shown in the modal header.
         */
        title: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            tab: "write",
            text: this.note || "",
        };
    },
    computed: {
        rendered() {
            return renderMarkdown(this.text);
        },
        tabs() {
            return [
                { value: "write", label: this.$t("Write") },
                { value: "preview", label: this.$t("Preview") },
            ];
        },
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$refs.editor) {
                this.$refs.editor.focus();
            }
        });
    },
    methods: {
        save() {
            if (!this.disabled) {
                this.onSave(this.text);
            }
        },
    },
};
</script>
