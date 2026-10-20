<template>
    <EscrPage
        class="escr-project-dashboard"
        :breadcrumbs="breadcrumbs"
        :sidebar-actions="sidebarActions"
        :loading="loading"
    >
        <template #page-content>
            <div class="escr-grid-container">
                <!-- Project metadata header -->
                <div class="escr-card escr-card-padding escr-project-details">
                    <div class="escr-card-header">
                        <h1>{{ projectName }}</h1>
                        <div class="escr-card-actions">
                            <VerticalMenu
                                :is-open="projectMenuOpen"
                                :close-menu="closeProjectMenu"
                                :open-menu="openProjectMenu"
                                :disabled="loading"
                                :items="projectMenuItems"
                            />
                            <EditProjectModal
                                v-if="editModalOpen"
                                :disabled="loading"
                                :fonts="fonts"
                                :on-cancel="closeEditModal"
                                :on-create-tag="createNewProjectTag"
                                :on-save="saveProject"
                                :tags="allProjectTags"
                            />
                        </div>
                    </div>
                    <a
                        v-if="guidelines"
                        :href="guidelines"
                        class="escr-project-guidelines"
                    >
                        {{ $t("Project Guidelines") }}
                    </a>
                    <EscrTags
                        v-if="tags"
                        :tags="tags"
                    />
                </div>
                <!-- Documents list -->
                <div class="escr-card escr-card-table escr-documents-list">
                    <div class="escr-card-header">
                        <h2>{{ $t("Documents") }}</h2>
                        <div class="escr-card-actions">
                            <FilterSet
                                :disabled="loading"
                                :tags="documentTags"
                                :on-filter="onFilterDocuments"
                                :search-placeholder="$t('Search documents...')"
                            />
                            <EscrButton
                                :label="$t('Create New')"
                                :on-click="openCreateDocumentModal"
                                :disabled="loading || createDocumentModalOpen"
                            >
                                <template #button-icon>
                                    <PlusIcon />
                                </template>
                            </EscrButton>
                            <EditDocumentModal
                                v-if="createDocumentModalOpen"
                                :disabled="loading"
                                :fonts="fonts"
                                :new-document="true"
                                :on-cancel="closeCreateDocumentModal"
                                :on-create-tag="createNewDocumentTag"
                                :on-save="createNewDocument"
                                :scripts="scripts"
                                :tags="documentTags"
                            />
                        </div>
                    </div>
                    <div
                        v-if="documents.length"
                        class="table-container"
                    >
                        <EscrTable
                            item-key="pk"
                            :headers="headers"
                            :items="documents"
                            :on-sort="sortDocuments"
                            :disabled="loading"
                            :linkable="true"
                        >
                            <template #actions="{ item }">
                                <EscrButton
                                    v-tooltip.bottom="$t('Note')"
                                    class="escr-note-button"
                                    size="small"
                                    color="text"
                                    :on-click="() => openNoteModal(item)"
                                    :disabled="loading"
                                    :aria-label="$t('Note')"
                                >
                                    <template #button-icon>
                                        <NoteIcon />
                                    </template>
                                </EscrButton>
                                <EscrButton
                                    v-tooltip.bottom="$t('Images')"
                                    size="small"
                                    color="text"
                                    :on-click="() => navigateToImages(item)"
                                    :disabled="loading"
                                    :aria-label="$t('Document images')"
                                >
                                    <template #button-icon>
                                        <ImagesIcon />
                                    </template>
                                </EscrButton>
                                <EscrButton
                                    v-tooltip.bottom="$t('Delete')"
                                    size="small"
                                    color="text"
                                    :on-click="() => openDeleteDocumentModal(item)"
                                    :disabled="loading"
                                    :aria-label="$t('Delete document')"
                                >
                                    <template #button-icon>
                                        <TrashIcon />
                                    </template>
                                </EscrButton>
                            </template>
                        </EscrTable>
                        <EscrButton
                            v-if="nextPage"
                            :label="$t('Load more')"
                            class="escr-load-more-btn"
                            color="outline-primary"
                            size="small"
                            :disabled="loading"
                            :on-click="async () => await fetchNextPage()"
                        />
                    </div>
                    <EscrLoader
                        v-else
                        :loading="loading"
                        :no-data-message="$t('There are no documents to display.')"
                    />
                </div>
                <!-- Default project ontology -->
                <ProjectOntologyCard :disabled="loading" />
                <!-- delete project modal -->
                <ConfirmModal
                    v-if="deleteModalOpen"
                    :body-text="$t('Are you sure you want to delete this project?')"
                    :confirm-verb="$t('Delete')"
                    :title="$t('Delete Project')"
                    :cannot-undo="true"
                    :disabled="loading"
                    :on-cancel="closeDeleteModal"
                    :on-confirm="deleteProject"
                />
                <!-- delete document modal -->
                <ConfirmModal
                    v-if="deleteDocumentModalOpen"
                    :body-text="$t('Are you sure you want to delete the document {name}?', {
                        name: (documentToDelete && documentToDelete.name) || '',
                    })"
                    :confirm-verb="$t('Delete')"
                    :title="$t('Delete {name}', {
                        name: (documentToDelete && documentToDelete.name) || $t('Document'),
                    })"
                    :cannot-undo="true"
                    :disabled="loading"
                    :on-cancel="closeDeleteDocumentModal"
                    :on-confirm="deleteDocument"
                />
                <!-- share project modal -->
                <ShareModal
                    v-if="shareModalOpen"
                    :groups="groups"
                    :disabled="loading"
                    :on-cancel="closeShareModal"
                    :on-submit="share"
                />
                <!-- document note modal -->
                <NoteModal
                    v-if="noteModalOpen"
                    :disabled="noteSaving"
                    :note="(noteTarget && noteTarget.note) || ''"
                    :on-cancel="closeNoteModal"
                    :on-save="saveNote"
                    :title="$t('Document note')"
                />
            </div>
        </template>
    </EscrPage>
</template>
<script>
import { mapActions, mapState } from "vuex";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal.vue";
import EditDocumentModal from "../../components/EditDocumentModal/EditDocumentModal.vue";
import EditProjectModal from "../../components/EditProjectModal/EditProjectModal.vue";
import EscrButton from "../../components/Button/Button.vue";
import EscrLoader from "../../components/Loader/Loader.vue";
import EscrPage from "../Page/Page.vue";
import EscrTable from "../../components/Table/Table.vue";
import EscrTags from "../../components/Tags/Tags.vue";
import FilterSet from "../../components/FilterSet/FilterSet.vue";
import ImagesIcon from "../../components/Icons/ImagesIcon/ImagesIcon.vue";
import PencilIcon from "../../components/Icons/PencilIcon/PencilIcon.vue";
import PeopleIcon from "../../components/Icons/PeopleIcon/PeopleIcon.vue";
import PlusIcon from "../../components/Icons/PlusIcon/PlusIcon.vue";
import ProjectOntologyCard from "../../components/ProjectOntologyCard/ProjectOntologyCard.vue";
import SearchIcon from "../../components/Icons/SearchIcon/SearchIcon.vue";
import SearchPanel from "../../components/SearchPanel/SearchPanel.vue";
import ShareModal from "../../components/SharePanel/ShareModal.vue";
import SharePanel from "../../components/SharePanel/SharePanel.vue";
import TrashIcon from "../../components/Icons/TrashIcon/TrashIcon.vue";
import VerticalMenu from "../../components/VerticalMenu/VerticalMenu.vue";
import NoteIcon from "../../components/Icons/NoteIcon/NoteIcon.vue";
import NoteModal from "../../components/NoteModal/NoteModal.vue";
import { updateDocumentNote } from "../../../src/api/document";
import "../../components/Common/Card.css"
import "./Project.css";
import { formatDate } from "../../util/dates";

export default {
    name: "EscrProjectDashboard",
    components: {
        ConfirmModal,
        EditDocumentModal,
        EditProjectModal,
        EscrButton,
        EscrLoader,
        EscrPage,
        EscrTable,
        EscrTags,
        FilterSet,
        ImagesIcon,
        // eslint-disable-next-line vue/no-unused-components
        PencilIcon,
        // eslint-disable-next-line vue/no-unused-components
        PeopleIcon,
        PlusIcon,
        ProjectOntologyCard,
        // eslint-disable-next-line vue/no-unused-components
        SearchPanel,
        ShareModal,
        // eslint-disable-next-line vue/no-unused-components
        SharePanel,
        TrashIcon,
        VerticalMenu,
        NoteIcon,
        NoteModal,
    },
    props: {
        /**
         * The primary key/id of the current project.
         */
        id: {
            type: Number,
            required: true,
        },
        /**
         * Whether or not search is disabled on the current instance.
         */
        searchDisabled: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            noteModalOpen: false,
            noteSaving: false,
            noteTarget: null,
        };
    },
    computed: {
        ...mapState({
            allProjectTags: (state) => state.projects.tags,
            createDocumentModalOpen: (state) => state.project.createDocumentModalOpen,
            deleteModalOpen: (state) => state.project.deleteModalOpen,
            deleteDocumentModalOpen: (state) => state.project.deleteDocumentModalOpen,
            documents: (state) => state.project.documents,
            documentTags: (state) => state.project.documentTags,
            documentToDelete: (state) => state.project.documentToDelete,
            editModalOpen: (state) => state.project.editModalOpen,
            groups: (state) => state.user.groups,
            guidelines: (state) => state.project.guidelines,
            loading: (state) => state.project.loading,
            nextPage: (state) => state.project.nextPage,
            projectName: (state) => state.project.name,
            projectId: (state) => state.project.id,
            projectMenuOpen: (state) => state.project.menuOpen,
            scripts: (state) => state.project.scripts,
            fonts: (state) => state.project.fonts,
            shareModalOpen: (state) => state.project.shareModalOpen,
            sharedWithUsers: (state) => state.project.sharedWithUsers,
            sharedWithGroups: (state) => state.project.sharedWithGroups,
            tags: (state) => state.project.tags,
        }),
        /**
         * Links and titles for the breadcrumbs above the page.
         */
        breadcrumbs() {
            return [
                { title: this.$t("My Projects"), href: "/projects" },
                { title: this.projectName || this.$t("Loading...") }
            ];
        },
        /**
         * Table headers for the document list in the project dashboard.
         */
        headers() {
            return [
                { label: this.$t("Name"), value: "name", sortable: true },
                { label: this.$t("Document Tags"), value: "tags", component: EscrTags },
                { label: this.$t("# of Images"), value: "parts_count", sortable: true  },
                {
                    label: this.$t("Last Update"),
                    value: "updated_at",
                    sortable: true,
                    format: formatDate,
                },
                // { label: "Default Transcription Level", value: "default_transcription_level"  },
            ];
        },
        /**
         * Menu items for the vertical menu in the top right corner of the dashboard.
         */
        projectMenuItems() {
            return [
                {
                    icon: PencilIcon,
                    key: "edit",
                    label: this.$t("Edit"),
                    onClick: this.openEditModal,
                },
                {
                    icon: TrashIcon,
                    // Add the "new-section" class if/when there is more than one item above this
                    // class: "new-section",
                    key: "delete",
                    label: this.$t("Delete Project"),
                    onClick: this.openDeleteModal,
                }
            ]
        },
        /**
         * Sidebar quick actions for the project dashboard.
         */
        sidebarActions() {
            let actions = [
                {
                    data: {
                        disabled: this.loading,
                        users: this.sharedWithUsers,
                        groups: this.sharedWithGroups,
                        openShareModal: this.openShareModal,
                    },
                    icon: PeopleIcon,
                    key: "share",
                    label: this.$t("Groups & Users"),
                    panel: SharePanel,
                },
            ];
            // if search is enabled on the instance, add search as first item
            if (!this.searchDisabled) {
                actions.unshift({
                    data: {
                        disabled: this.loading,
                        projectId: this.projectId,
                        searchScope: "Project",
                    },
                    icon: SearchIcon,
                    key: "search",
                    label: this.$t("Search Project"),
                    panel: SearchPanel,
                });
            }
            return actions;
        },
    },
    /**
     * On load, fetch basic details about the project.
     */
    async created() {
        this.setLoading(true);
        this.setId(this.id);
        try {
            await this.fetchProject();
            await this.fetchGroups();
        } catch (error) {
            this.addError(error);
        }
        this.setLoading(false);
    },
    methods: {
        ...mapActions("project", [
            "closeCreateDocumentModal",
            "closeDeleteModal",
            "closeDeleteDocumentModal",
            "closeEditModal",
            "closeProjectMenu",
            "closeShareModal",
            "createNewDocumentTag",
            "createNewDocument",
            "createNewProjectTag",
            "deleteDocument",
            "deleteProject",
            "fetchNextPage",
            "fetchProject",
            "fetchProjectDocuments",
            "openCreateDocumentModal",
            "openDeleteModal",
            "openDeleteDocumentModal",
            "openEditModal",
            "openProjectMenu",
            "openShareModal",
            "searchProject",
            "saveProject",
            "setDocumentToDelete",
            "setId",
            "setLoading",
            "share",
            "sortDocuments",
        ]),
        ...mapActions("projects", ["fetchAllProjectTags"]),
        ...mapActions("user", ["fetchGroups"]),
        openNoteModal(item) {
            this.noteTarget = item;
            this.noteModalOpen = true;
        },
        closeNoteModal() {
            this.noteModalOpen = false;
            this.noteTarget = null;
        },
        /**
         * Persist the markdown note attached to a document of this project.
         */
        async saveNote(text) {
            if (!this.noteTarget) {
                return;
            }
            this.noteSaving = true;
            try {
                await updateDocumentNote({
                    documentId: this.noteTarget.pk,
                    note: text,
                });
                const documents = this.documents.map((document) =>
                    document.pk === this.noteTarget.pk
                        ? { ...document, note: text }
                        : document
                );
                this.$store.commit("project/setDocuments", documents);
                this.noteModalOpen = false;
                this.noteTarget = null;
                this.$store.commit("alerts/addAlert", {
                    color: "success",
                    message: this.$t("Note saved successfully"),
                });
            } catch (error) {
                this.addError(error);
            } finally {
                this.noteSaving = false;
            }
        },
        ...mapActions("alerts", ["addError"]),
        async onFilterDocuments() {
            this.setLoading(true);
            try {
                await this.fetchProjectDocuments();
            } catch (error) {
                this.addError(error);
            }
            this.setLoading(false);
        },
        navigateToImages(item) {
            if (item?.pk) {
                window.location = `/document/${item.pk}/images`;
            } else {
                this.addError({ message: this.$t("Error navigating to the images page.") });
            }
        },
    },
}
</script>
