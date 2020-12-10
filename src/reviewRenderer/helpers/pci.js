/**
 * List of interactable PCIs
 */
const interactablePcis = ['textReaderInteraction'];

/**
 * Returns a boolean based on weather the PCI should allow interaction or not in review mode
 *
 * @param {String} pciType
 * @returns {Boolean}
 */
export const isInteractionDisabled = pciType => {
    return interactablePcis.indexOf(pciType) === -1;
};
