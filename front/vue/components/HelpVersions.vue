<template>
    <p style="direction:ltr">
        {{ $t("Each line corresponds to an edition of the content, in inverse chronological order (Most recent at the top).") }}
        <br>{{ $t("The colors represent the difference with the previous version,") }}
        <br><font color="green">{{ $t("green are additions") }}</font> <font color="red">{{ $t("red are deletions,") }}</font>
        <br>{{ $t("meaning red characters are not actually part of the line anymore, they are displayed to easily spot the differences.") }}
        <br>{{ $t("You can mouse over the text to see the actual content.") }}
        <br>{{ $t("The load state button") }} <i class="fas fa-file-upload" /> {{ $t("simply revert the content of the line to the corresponding text version.") }}
    </p>
</template>

<script>
export default {}
</script>

<style scoped>
</style>
