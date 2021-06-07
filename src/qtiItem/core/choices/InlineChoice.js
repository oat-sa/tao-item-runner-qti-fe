import QtiTextVariableChoice from 'taoQtiItem/qtiItem/core/choices/TextVariableChoice';
import Container from 'taoQtiItem/qtiItem/mixin/ContainerInline';
var QtiInlineChoice = QtiTextVariableChoice.extend({
    qtiClass: 'inlineChoice'
});
Container.augment(QtiInlineChoice);
export default QtiInlineChoice;
