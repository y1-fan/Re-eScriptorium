<template>
    <EscrModal class="escr-moveimages-modal">
        <template #modal-header>
            <h2>{{ $tn(selectedParts.length, "Move Image", "Move Images") }}</h2>
        </template>
        <template #modal-content>
            {{ moveMessage }}
            <h3>
                {{ $t("Location") }}<span
                    :aria-label="$t('required')"
                    class="escr-required"
                >*</span>
            </h3>
            <div class="escr-form-field">
                <SegmentedButtonGroup
                    color="secondary"
                    name="move-image-location"
                    :disabled="disabled"
                    :options="locationOptions"
                    :on-change-selection="(v) => handleChange('location', v)"
                />
            </div>
            <h3>
                {{ $t("New Position") }}<span
                    :aria-label="$t('required')"
                    class="escr-required"
                >*</span>
            </h3>
            <label class="escr-text-field">
                <input
                    type="number"
                    min="1"
                    :max="partsCount"
                    :placeholder="$t('Number')"
                    :disabled="disabled"
                    :value="index"
                    @input="(e) => handleChange('index', e.target.value)"
                >
                <span>{{ $t("of {count}", { count: partsCount }) }}</span>
            </label>
        </template>
        <template #modal-actions>
            <EscrButton
                color="outline-primary"
                :label="$t('Cancel')"
                :on-click="onCancel"
                :disabled="disabled"
            />
            <VDropdown
                v-if="invalid"
                :triggers="['hover']"
                theme="escr-tooltip-small"
                placement="bottom"
            >
                <EscrButton
                    :label="$t('Move')"
                    :on-click="() => {}"
                    :disabled="true"
                />
                <template #popper>
                    {{ $t("Position is required and must be between 1 and {count}", {
                        count: partsCount.toString(),
                    }) }}
                </template>
            </VDropdown>
            <EscrButton
                v-else
                color="primary"
                :label="$t('Move')"
                :on-click="onSubmit"
                :disabled="disabled || invalid"
            />
        </template>
    </EscrModal>
</template>
<script>
import { mapActions, mapState } from "vuex";
import EscrButton from "../Button/Button.vue";
import EscrModal from "../Modal/Modal.vue";
import SegmentedButtonGroup from "../SegmentedButtonGroup/SegmentedButtonGroup.vue";
import "../TextField/TextField.css";
import "./MoveImagesModal.css";
import { Dropdown as VDropdown } from "floating-vue";

export default {
    name: "EscrMoveImagesModal",
    components: {
        EscrButton,
        EscrModal,
        SegmentedButtonGroup,
        VDropdown,
    },
    props: {
        /**
         * Boolean indicating whether or not the form fields should be disabled.
         */
        disabled: {
            type: Boolean,
            required: true,
        },
        /**
         * Callback function for clicking "cancel".
         */
        onCancel: {
            type: Function,
            required: true,
        },
        /**
         * Callback function for clicking "submit".
         */
        onSubmit: {
            type: Function,
            required: true,
        },
    },
    computed: {
        ...mapState({
            index: (state) => state.forms.moveImages.index,
            location: (state) => state.forms.moveImages.location,
            partsCount: (state) => state.document.partsCount,
            selectedParts: (state) => state.images.selectedParts,
        }),
        /**
         * Message describing how many images will be moved
         */
        moveMessage() {
            return this.selectedParts.length > 1
                ? this.$t("Move {count} selected images to the following position", {
                    count: this.selectedParts.length,
                })
                : this.$t("Move {count} selected image to the following position", {
                    count: this.selectedParts.length,
                });
        },
        /**
         * Choices for location (before/after the chosen position)
         */
        locationOptions() {
            return [
                {
                    label: this.$t("Before"),
                    value: "before",
                    selected: this.location === "before",
                },
                {
                    label: this.$t("After"),
                    value: "after",
                    selected: this.location === "after",
                },
            ]
        },
        /**
         * Invalid if no index or index out of bounds
         */
        invalid() {
            const idx = parseInt(this.index);
            return !idx || idx > this.partsCount.length || idx < 1;
        },
    },
    methods: {
        ...mapActions("forms", ["handleGenericInput"]),
        handleChange(field, value) {
            this.handleGenericInput({ form: "moveImages", field, value });
        },
    }
};
</script>
