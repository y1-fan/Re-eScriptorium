<template>
    <ul class="escr-quick-actions">
        <li>
            <VDropdown
                placement="left"
                :triggers="['hover']"
                theme="tags-dropdown"
            >
                <EscrButton
                    color="text"
                    :disabled="!data || data.disabled"
                    :on-click="() => openModal('import')"
                    :label="$t('Import')"
                >
                    <template #button-icon>
                        <ImportIcon />
                    </template>
                </EscrButton>
                <template #popper>
                    <span class="escr-tooltip-text">
                        {{ $t("Import images or transcription content.") }}
                    </span>
                </template>
            </VDropdown>
        </li>
        <li>
            <EscrButton
                color="text"
                :disabled="!data || data.disabled"
                :on-click="() => openModal('segment')"
                :label="$t('Segment {scope}', { scope: scopeLabel })"
            >
                <template #button-icon>
                    <SegmentIcon />
                </template>
            </EscrButton>
        </li>
        <li>
            <EscrButton
                color="text"
                :disabled="!data || data.disabled"
                :on-click="() => openModal('transcribe')"
                :label="$t('Transcribe {scope}', { scope: scopeLabel })"
            >
                <template #button-icon>
                    <TranscribeIcon />
                </template>
            </EscrButton>
        </li>
        <li>
            <EscrButton
                color="text"
                :disabled="!data || data.disabled"
                :on-click="() => openModal('align')"
                :label="$t('Align {scope}', { scope: scopeLabel })"
            >
                <template #button-icon>
                    <AlignIcon />
                </template>
            </EscrButton>
        </li>
        <li>
            <EscrButton
                color="text"
                :disabled="!data || data.disabled"
                :on-click="() => openModal('export')"
                :label="$t('Export {scope}', { scope: scopeLabel })"
            >
                <template #button-icon>
                    <ExportIcon />
                </template>
            </EscrButton>
        </li>
        <li>
            <EscrButton
                color="text"
                :disabled="!data || data.disabled"
                :on-click="() => openModal('downloadArchive')"
                :label="$t('Download Archive {scope}', { scope: scopeLabel })"
            >
                <template #button-icon>
                    <DownloadIcon />
                </template>
            </EscrButton>
        </li>
    </ul>
</template>

<script>
import { Dropdown as VDropdown } from "floating-vue";
import { mapActions } from "vuex";
import AlignIcon from "../Icons/AlignIcon/AlignIcon.vue";
import DownloadIcon from "../Icons/DownloadIcon/DownloadIcon.vue";
import EscrButton from "../Button/Button.vue";
import ExportIcon from "../Icons/ExportIcon/ExportIcon.vue";
import ImportIcon from "../Icons/ImportIcon/ImportIcon.vue";
import SegmentIcon from "../Icons/SegmentIcon/SegmentIcon.vue";
import TranscribeIcon from "../Icons/TranscribeIcon/TranscribeIcon.vue";
import "./QuickActionsPanel.css";

export default {
    name: "EscrQuickActionsPanel",
    components: {
        AlignIcon,
        DownloadIcon,
        EscrButton,
        ExportIcon,
        ImportIcon,
        SegmentIcon,
        TranscribeIcon,
        VDropdown,
    },
    props: {
        /**
         * Data for the quick actions panel, an object containing:
         * {
         *     disabled: Boolean, // true if the buttons on the panel should be disabled
         *     scope: String, // indicate if this panel is for "Document" or "Elements"
         * }
         */
        data: {
            type: Object,
            required: true,
        },
    },
    computed: {
        /**
         * Translated label for the action scope (e.g. "Document", "3 Images").
         */
        scopeLabel() {
            const scope = (this.data && this.data.scope) || "";
            if (scope === "Document") {
                return this.$t("Document");
            }
            if (scope === "Image") {
                return this.$t("Image");
            }
            const match = /^(\d+) Images$/.exec(scope);
            if (match) {
                return this.$t("{count} Images", { count: match[1] });
            }
            return scope;
        },
    },
    methods: {
        ...mapActions("tasks", [
            "closeModal",
            "openModal",
        ]),
    }
};
</script>
