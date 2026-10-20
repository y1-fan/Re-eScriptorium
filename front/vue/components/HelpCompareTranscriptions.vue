<template>
    <p style="direction:ltr">
        {{ $t("Each line is a different transcription as checked in the transcription management window") }} <i class="fas fa-cog" />
        <br>{{ $t("The colors represent the difference with the current transcription,") }}
        <br><font color="green">
            {{ $t("green") }}
        </font> {{ $t("characters are not present in the current (editable) transcription while") }} <font color="red">
            {{ $t("red") }}
        </font> {{ $t("characters are not present in the compared transcription.") }}
    </p>
</template>

<script>
export default {}
</script>

<style scoped>
</style>
