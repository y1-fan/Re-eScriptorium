<template>
    <div class="escr-card escr-card-padding escr-project-ontology escr-project-ontology-card">
        <div class="escr-card-header">
            <h2>{{ $t("Default Ontology") }}</h2>
            <div class="escr-card-actions">
                <input
                    ref="importInput"
                    type="file"
                    accept=".json,.yaml,.yml"
                    class="sr-only"
                    @change="onImportFileChange"
                >
                <EscrButton
                    color="text"
                    size="small"
                    :label="$t('Import')"
                    :disabled="disabled"
                    :on-click="onClickImport"
                >
                    <template #button-icon>
                        <UploadIcon class="escr-ontology-action-icon" />
                    </template>
                </EscrButton>
                <EscrButton
                    v-if="ontologyConfig"
                    color="text"
                    size="small"
                    :label="$t('Export')"
                    :disabled="disabled"
                    :on-click="exportOntology"
                >
                    <template #button-icon>
                        <DownloadIcon />
                    </template>
                </EscrButton>
                <EscrButton
                    v-if="ontologyConfig"
                    color="text"
                    size="small"
                    :label="$t('Clear')"
                    :disabled="disabled"
                    :on-click="onClickClear"
                >
                    <template #button-icon>
                        <TrashIcon />
                    </template>
                </EscrButton>
            </div>
        </div>
        <p v-if="!ontologyConfig" class="escr-project-ontology-empty">
            {{ $t("No default ontology set. New documents in this project will use the instance's default types instead.") }}
        </p>
        <p v-else class="escr-project-ontology-summary">
            {{ summary }}
        </p>
        <ConfirmModal
            v-if="clearModalOpen"
            :body-text="$t('Are you sure you want to clear this project\'s default ontology?')"
            :confirm-verb="$t('Clear')"
            :title="$t('Clear Default Ontology')"
            :cannot-undo="true"
            :disabled="disabled"
            :on-cancel="closeClearModal"
            :on-confirm="onConfirmClear"
        />
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import ConfirmModal from "../ConfirmModal/ConfirmModal.vue";
import DownloadIcon from "../Icons/DownloadIcon/DownloadIcon.vue";
import EscrButton from "../Button/Button.vue";
import TrashIcon from "../Icons/TrashIcon/TrashIcon.vue";
import UploadIcon from "../Icons/UploadIcon/UploadIcon.vue";
import "./ProjectOntologyCard.css";

export default {
    name: "EscrProjectOntologyCard",
    components: { ConfirmModal, DownloadIcon, EscrButton, TrashIcon, UploadIcon },
    props: {
        /**
         * Whether or not data is loading/actions should be disabled.
         */
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            clearModalOpen: false,
        };
    },
    computed: {
        ...mapState({
            ontologyConfig: (state) => state.project.ontologyConfig,
        }),
        /**
         * Human-readable summary of the stored default ontology config.
         */
        summary() {
            if (!this.ontologyConfig) return "";
            const counts = [
                ["region type", "region types", this.ontologyConfig.region_types],
                ["line type", "line types", this.ontologyConfig.line_types],
                ["part type", "part types", this.ontologyConfig.part_types],
                ["annotation component", "annotation components", this.ontologyConfig.annotation_components],
                ["taxonomy", "taxonomies", this.ontologyConfig.taxonomy],
            ]
                .filter(([, , list]) => list && list.length)
                .map(([singular, plural, list]) => this.$t("{count} {label}", {
                    count: list.length,
                    label: this.$t(list.length === 1 ? singular : plural),
                }));
            if (!counts.length) {
                return this.$t("Empty ontology config.");
            }
            // Chinese uses full-width separators and a full stop.
            const separator = this.$lang === "zh" ? "，" : ", ";
            const end = this.$lang === "zh" ? "。" : ".";
            return counts.join(separator) + end;
        },
    },
    methods: {
        ...mapActions("project", ["clearOntology", "exportOntology", "importOntology"]),
        /**
         * Trigger the hidden file input for importing an ontology config
         */
        onClickImport() {
            this.$refs.importInput.click();
        },
        /**
         * Handle a file being selected for import
         */
        async onImportFileChange(e) {
            const file = e.target.files[0];
            e.target.value = "";
            if (file) {
                await this.importOntology(file);
            }
        },
        onClickClear() {
            this.clearModalOpen = true;
        },
        closeClearModal() {
            this.clearModalOpen = false;
        },
        async onConfirmClear() {
            await this.clearOntology();
            this.clearModalOpen = false;
        },
    },
};
</script>
