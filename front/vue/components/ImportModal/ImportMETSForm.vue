<template>
    <div>
        <h3>{{ $t("Import images, segmentation and transcriptions described by METS") }}</h3>
        <fieldset>
            <SegmentedButtonGroup
                color="secondary"
                name="mets-type"
                :on-change-selection="handleMetsTypeChange"
                :options="metsOptions"
            />
            <div
                v-if="metsType === 'local'"
            >
                <input
                    type="file"
                    accept=".zip"
                    :class="{ invalid: invalid['file'] }"
                    @change="handleFileChange"
                >
                <span class="escr-help-text">
                    {{ $t("A single ZIP archive described by a METS file contained inside it.") }}
                </span>
            </div>
            <div v-else>
                <TextField
                    :label="$t('Remote METS URI')"
                    :placeholder="$t('Enter METS file URI')"
                    :invalid="invalid['metsUri']"
                    :label-visible="false"
                    :value="metsUri"
                    :on-input="handleMetsUriInput"
                />
            </div>
            <TextField
                :label="$t('Transcription Name')"
                :help-text="$t('The name of the resulting transcription layer.')"
                :placeholder="$t('Name')"
                :invalid="invalid['layerName']"
                :value="layerName"
                :on-input="handleLayerNameInput"
            />
            <div class="escr-form-field escr-checkbox-field escr-overwrite-field">
                <label>
                    <input
                        type="checkbox"
                        value="overwrite"
                        :checked="overwrite === true"
                        @change="handleOverwriteChange"
                    >
                    {{ $t("Overwrite Existing Segmentation and Transcriptions") }}
                </label>
                <span class="escr-help-text">
                    {{ $t("Overwriting destroys existing regions, lines and any bound transcriptions before importing.") }}
                </span>
            </div>
        </fieldset>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import SegmentedButtonGroup from "../SegmentedButtonGroup/SegmentedButtonGroup.vue";
import TextField from "../TextField/TextField.vue";

export default {
    name: "EscrImportMETSForm",
    components: {
        SegmentedButtonGroup,
        TextField,
    },
    props: {
        invalid: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState({
            layerName: (state) => state.forms.import.layerName,
            metsType: (state) => state.forms.import.metsType,
            metsUri: (state) => state.forms.import.metsUri,
            overwrite: (state) => state.forms.import.overwrite,
        }),
        metsOptions() {
            return [
                { value: "url", label: this.$t("Enter URL"), selected: this.metsType === "url" },
                { value: "local", label: this.$t("Upload file"), selected: this.metsType === "local" }
            ];
        },
    },
    methods: {
        ...mapActions("forms", [
            "handleGenericInput",
        ]),
        handleFileChange(e) {
            this.handleGenericInput({
                form: "import",
                field: "uploadFile",
                value: e.target.files[0],
            });
        },
        handleMetsTypeChange(value) {
            this.handleGenericInput({
                form: "import", field: "metsType", value
            });
        },
        handleLayerNameInput(e) {
            this.handleGenericInput({
                form: "import", field: "layerName", value: e.target.value
            });
        },
        handleMetsUriInput(e) {
            this.handleGenericInput({
                form: "import", field: "metsUri", value: e.target.value
            });
        },
        handleOverwriteChange(e) {
            this.handleGenericInput({
                form: "import", field: "overwrite", value: e.target.checked
            });
        },
    },
}
</script>
