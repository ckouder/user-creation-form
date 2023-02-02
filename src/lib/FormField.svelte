<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {SelectOption} from "./type";

    export let type: string;
    export let name: string;
    export let invalid = false;
    export let hint = "";

    export let options: Array<SelectOption> = [];

    let value: string = '';

    const dispatch = createEventDispatcher();

    function onInput() {
        dispatch("input", this.value);
    }
</script>

<div class="form-field">
    <label for="{name}">{name}:</label>
    <div class="form-input">
        {#if type === "select"}
            <div class="select-container">
                <select name="{name}" id="{name}" on:input={onInput}>
                    {#each options as option}
                        <option value="{option.value}">{option.name}</option>
                    {/each}
                </select>
            </div>
        {:else}
            <input id="{name}" name="{name}" on:input={onInput} type="{type}" value="{value}">
        {/if}
        <p class="{invalid ? 'invalid-reason' : 'hint'}">{hint}</p>
    </div>
</div>

<style lang="sass">
  .form-field
    position: relative
    display: flex
    flex-direction: column
    justify-content: center
    margin-bottom: .5em

    label
      padding-right: .5em
      font-size: 1em
      text-align: start
      color: var(--text-color)

    .form-input
      display: inline-block

      input, select
        -webkit-appearance: none
        appearance: none
        box-sizing: border-box
        width: 100%
        height: 30px
        padding: 2px 5px
        border: 1px var(--border-color) solid
        border-radius: 4px
        box-shadow: none
        color: var(--text-color)

        &:focus
            outline: 4px auto #646cff

      .select-container
        position: relative
        &::after
            position: absolute
            display: block
            top: 4px
            right: 10px
            height: 15px
            width: 15px
            content: "▽"
            color: var(--text-color)
            opacity: 40%
            pointer-events: none

      .hint, .invalid-reason
        padding: 0px 2px
        margin: 0
        font-size: .9em
        text-align: right

        -webkit-user-select: none
        user-select: none

      .hint
        color: transparent

      .invalid-reason
        color: deeppink
</style>