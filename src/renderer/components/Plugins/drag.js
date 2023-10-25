const DragPlugin = {}
import { mapGetters } from 'vuex'
import Constant from '../../../Constant'

DragPlugin.install = function (Vue, options) {
  var selections = {
      items      : [],
      owner      : null,
      droptarget : null
  }

  var targets = []
  var items = []
  var targetEle = null

  Vue.prototype.$getSelectrions = function () {
    return selections
  }
  Vue.prototype.$initDrag = function () {
    setTimeout(() => {
      targets = document.getElementsByClassName('data-draggable-target')
      items = document.getElementsByClassName('data-draggable-item')

      //get the collection of draggable targets and add their draggable attribute
      for(var len = targets.length, i = 0; i < len; i ++) {
        targets[i].setAttribute('aria-dropeffect', 'none')
      }

      //get the collection of draggable items and add their draggable attributes
      for(var len = items.length, i = 0; i < len; i ++) {
        items[i].setAttribute('draggable', 'true')
        items[i].setAttribute('aria-grabbed', 'false')
        items[i].setAttribute('tabindex', '0')
      }

      selections.owner = null

    }, 0)
  }

  Vue.mixin({
    computed: {
      // ...mapGetters({
      //   classList: Constant.GET_WBC_CLASS_LIST,
      //   bfClassList: Constant.GET_BF_WBC_CLASS_LIST
      // })
    },
    beforeDestroy () {
    },
    mounted () {
      console.log('drag mounted~~~!!')
    }
  })

  Vue.directive('drag-target', {
    bind: function(el, bind, vnode) {
      if (!document.querySelectorAll || !('draggable' in document.createElement('span')) || window.opera) {
        return
      }

      setTimeout(() => {
        targets = document.getElementsByClassName('data-draggable-target')
        items = document.getElementsByClassName('data-draggable-item')

        //get the collection of draggable targets and add their draggable attribute
        for(var len = targets.length, i = 0; i < len; i ++) {
          targets[i].setAttribute('aria-dropeffect', 'none')
        }

        //get the collection of draggable items and add their draggable attributes
        for(var len = items.length, i = 0; i < len; i ++) {
          items[i].setAttribute('draggable', 'true')
          items[i].setAttribute('aria-grabbed', 'false')
          items[i].setAttribute('tabindex', '0')
        }
      }, 0)

      var addSelection = function(item) {
        //if the owner reference is still null, set it to this item's parent
        //so that further selection is only allowed within the same container
        if(!selections.owner) {
          selections.owner = item.parentNode
        }

        //or if that's already happened then compare it with this item's parent
        //and if they're not the same container, return to prevent selection
        else if(selections.owner != item.parentNode) {
          return
        }

        //set this item's grabbed state
        item.setAttribute('aria-grabbed', 'true')

        //add it to the items array
        selections.items.push(item)
      }

      //function for unselecting an item
      var removeSelection = function(item) {
        //reset this item's grabbed state
        item.setAttribute('aria-grabbed', 'false');

        //then find and remove this item from the existing items array
        for(var len = selections.items.length, i = 0; i < len; i ++) {
          if(selections.items[i] == item) {
            selections.items.splice(i, 1)
            break
          }
        }
      }

      //function for resetting all selections
      var clearSelections = function() {
        //if we have any selected items
        if(selections.items.length) {
          //reset the owner reference
          selections.owner = null

          //reset the grabbed state on every selected item
          for(var len = selections.items.length, i = 0; i < len; i ++) {
            selections.items[i].setAttribute('aria-grabbed', 'false')
          }

          //then reset the items array
          selections.items = []
        }
      }

      //shorctut function for testing whether a selection modifier is pressed
      var hasModifier = function(e) {
        return (e.ctrlKey || e.metaKey || e.shiftKey)
      }

      //function for applying dropeffect to the target containers
      var addDropeffects = function() {
        //apply aria-dropeffect and tabindex to all targets apart from the owner
        for(var len = targets.length, i = 0; i < len; i ++) {
          if ( targets[i] != selections.owner && targets[i].getAttribute('aria-dropeffect') == 'none') {
            if (targets[i].id !== 'classTab') {
              targets[i].setAttribute('aria-dropeffect', 'move')
              targets[i].setAttribute('tabindex', '0')
            }
          }
        }

        //remove aria-grabbed and tabindex from all items inside those containers
        for(var len = items.length, i = 0; i < len; i ++) {
          if (items[i].parentNode != selections.owner && items[i].getAttribute('aria-grabbed')) {
            items[i].removeAttribute('aria-grabbed')
            items[i].removeAttribute('tabindex')
          }
        }
      }

      //function for removing dropeffect from the target containers
      var clearDropeffects = function() {
        //if we have any selected items
        if(selections.items.length) {
          //reset aria-dropeffect and remove tabindex from all targets
          for(var len = targets.length, i = 0; i < len; i ++) {
            if(targets[i].getAttribute('aria-dropeffect') != 'none') {
              targets[i].setAttribute('aria-dropeffect', 'none')
              targets[i].removeAttribute('tabindex')
            }
          }

          //restore aria-grabbed and tabindex to all selectable items
          //without changing the grabbed value of any existing selected items
          for(var len = items.length, i = 0; i < len; i ++) {
            if(!items[i].getAttribute('aria-grabbed')) {
              items[i].setAttribute('aria-grabbed', 'false')
              items[i].setAttribute('tabindex', '0')
            } else if(items[i].getAttribute('aria-grabbed') == 'true') {
              items[i].setAttribute('tabindex', '0')
            }
          }
        }
      }

      //shortcut function for identifying an event element's target container
      var clearDropeffectsEl = function(element) {
        do {
          if(element.nodeType == 1 && element.getAttribute('aria-dropeffect')) {
            return element
          }
        } while(element = element.parentNode)

        return null
      }

      //shortcut function for identifying an event element's target container
      var getContainer = function(element) {
        do {
          if(element.nodeType == 1 && element.getAttribute('aria-dropeffect')) {
            return element
          }
        } while(element = element.parentNode)

        return null
      }

      el.addEventListener('mousedown', function(evt) {
        // signed된 항목 or 오른쪽 마우스 return
        // if (evt.target.getAttribute('signed') === 'true' || (evt.which === 3)) {
        //   return
        // }

        if (evt.target.getAttribute('signed') === 'true') {
          return
        }

        //if the element is a draggable item
        if(evt.target.getAttribute('draggable')) {
          //clear dropeffect from the target containers
          clearDropeffects()

          //if the multiple selection modifier is not pressed
          //and the item's grabbed state is currently false
          if (!hasModifier(evt) && evt.target.getAttribute('aria-grabbed') == 'false') {
            //clear all existing selections
            clearSelections()

            //then add this new selection
            addSelection(evt.target)
          }
        }

        //else [if the element is anything else]
        //and the selection modifier is not pressed
        else if(!hasModifier(evt)) {
          //clear dropeffect from the target containers
          clearDropeffects()

          //clear all existing selections
          clearSelections()
        }

        //else [if the element is anything else and the modifier is pressed]
        else {
          //clear dropeffect from the target containers
          clearDropeffects()
        }
      })
      el.addEventListener('mouseup', function(evt) {
        // signed된 항목 or 오른쪽 마우스 return
        // if (evt.target.getAttribute('signed') === 'true' || (evt.which === 3)) {
        //   return
        // }

        if (evt.target.getAttribute('signed') === 'true') {
          return
        }

        // if the element is a draggable item
        // and the multipler selection modifier is pressed
        if(evt.target.getAttribute('draggable') && hasModifier(evt)) {
          //if the item's grabbed state is currently true
          if(evt.target.getAttribute('aria-grabbed') == 'true') {
            //unselect this item
            removeSelection(evt.target)

            // if that was the only selected item
            // then reset the owner container reference
            if(!selections.items.length)
            {
              selections.owner = null
            }
          }

          //else [if the item's grabbed state is false]
          else {
            //add this additional selection
            addSelection(evt.target)

            // 시프트키 입력하고 선택시 여러 항목 선택
            if (evt.shiftKey) {
              var parents = evt.target.parentNode
              var images = parents.querySelectorAll('img')
              var startIdx = 0
              var endIdx = 0

              if (selections.items.length >= 2) {
                for (var i = 0; i < images.length; i++) {
                  if (selections.items[0].id === images[i].id) {
                    startIdx = i
                  }
                  else if (selections.items[selections.items.length - 1].id === images[i].id) {
                    endIdx = i
                  }
                }

                for (var j = startIdx; j < endIdx; j++) {
                  if (images[j].getAttribute('aria-grabbed') == 'false') {
                    addSelection(images[j])
                  }
                }
              }
            }
          }
        }
      })
      el.addEventListener('dragstart', function(evt) {
        // signed된 항목 return
        if (evt.target.getAttribute('signed') === 'true') {
          return
        }
        // if the element's parent is not the owner, then block this event
        if(selections.owner != evt.target.parentNode) {
          evt.preventDefault()
          return
        }

        //[else] if the multiple selection modifier is pressed
        //and the item's grabbed state is currently false
        if(hasModifier(evt) && evt.target.getAttribute('aria-grabbed') == 'false') {
          //add this additional selection
          addSelection(evt.target)
        }

        //we don't need the transfer data, but we have to define something
        //otherwise the drop action won't work at all in firefox
        //most browsers support the proper mime-type syntax, eg. "text/plain"
        //but we have to use this incorrect syntax for the benefit of IE10+
        evt.dataTransfer.setData('text', '')

        //apply dropeffect to the target containers
        addDropeffects()
      })
      el.addEventListener('keydown', function(evt) {
        // signed된 항목 return
        if (evt.target.getAttribute('signed') === 'true') {
          return
        }

        //if the element is a grabbable item
        if(evt.target.getAttribute('aria-grabbed')) {
          //Space is the selection or unselection keystroke
          if(evt.keyCode == 32) {
            //if the multiple selection modifier is pressed
            if(hasModifier(evt)) {
              //if the item's grabbed state is currently true
              if(evt.target.getAttribute('aria-grabbed') == 'true') {
                //if this is the only selected item, clear dropeffect
                //from the target containers, which we must do first
                //in case subsequent unselection sets owner to null
                if(selections.items.length == 1) {
                  clearDropeffects()
                }

                //unselect this item
                removeSelection(evt.target)

                //if we have any selections
                //apply dropeffect to the target containers,
                //in case earlier selections were made by mouse
                if(selections.items.length) {
                  addDropeffects()
                }

                //if that was the only selected item
                //then reset the owner container reference
                if(!selections.items.length) {
                  selections.owner = null
                }
              }

              //else [if its grabbed state is currently false]
              else {
                //add this additional selection
                addSelection(evt.target)

                //apply dropeffect to the target containers
                addDropeffects()
              }
            }

            //else [if the multiple selection modifier is not pressed]
            //and the item's grabbed state is currently false
            else if(evt.target.getAttribute('aria-grabbed') == 'false') {
              //clear dropeffect from the target containers
              clearDropeffects()

              //clear all existing selections
              clearSelections()

              //add this new selection
              addSelection(evt.target)

              //apply dropeffect to the target containers
              addDropeffects()
            }

            //else [if modifier is not pressed and grabbed is already true]
            else {
              //apply dropeffect to the target containers
              addDropeffects()
            }

            //then prevent default to avoid any conflict with native actions
            evt.preventDefault()
          }

          //Modifier + M is the end-of-selection keystroke
          if(evt.keyCode == 77 && hasModifier(evt)) {
            //if we have any selected items
            if(selections.items.length) {
              //apply dropeffect to the target containers
              //in case earlier selections were made by mouse
              addDropeffects()

              //if the owner container is the last one, focus the first one
              if(selections.owner == targets[targets.length - 1]) {
                targets[0].focus()
              }

              //else [if it's not the last one], find and focus the next one
              else {
                for(var len = targets.length, i = 0; i < len; i ++) {
                  if(selections.owner == targets[i]) {
                    targets[i + 1].focus()
                    break
                  }
                }
              }
            }

            //then prevent default to avoid any conflict with native actions
            evt.preventDefault()
          }
        }

        //Escape is the abort keystroke (for any target element)
        if(evt.keyCode == 27) {
          //if we have any selected items
          if(selections.items.length) {
            //clear dropeffect from the target containers
            clearDropeffects()

            //then set focus back on the last item that was selected, which is
            //necessary because we've removed tabindex from the current focus
            selections.items[selections.items.length - 1].focus()

            //clear all existing selections
            clearSelections()
            //but don't prevent default so that native actions can still occur
          }
        }
      })
      el.addEventListener('dragenter', function(evt) {
        // signed된 항목 return
        if (evt.target.getAttribute('signed') === 'true') {
          return
        }

        var related = evt.target
        var droptarget = getContainer(related)

        // if the target is the owner then it's not a valid drop target
        // 동일 타겟으로 이동 가능하도록 수정 (스타고 요청 - 불가)
        if(droptarget == selections.owner) {
          droptarget = null
        }

        if (droptarget == null) {
          for (var i = 0; i < items.length; i++) {
            items[i].className = items[i].className.replace(/ translate/g, '')
          }
        }

        if (related.getAttribute('data-draggable') === 'item') {
          for (var i = 0; i < selections.items.length; i++) {
            // 동일 타겟으로 이동 가능하도록 수정
            // if (related == selections.items[i]) {
            //   console.log('111111111111111111')
            // } else {
            //
            //   if (droptarget != null && droptarget.childNodes != null) {
            //     for (var i = 0; i < items.length; i++) {
            //       items[i].className = items[i].className.replace(/ translate/g, '')
            //     }
            //
            //     related.className += ' translate'
            //     targetEle = related
            //   }
            // }

            if (droptarget != null && droptarget.childNodes != null) {
              for (var i = 0; i < items.length; i++) {
                items[i].className = items[i].className.replace(/ translate/g, '')
              }

              related.className += ' translate'
              targetEle = related
            }
          }
        }

        // for(var len = selections.items.length, i = 0; i < len; i ++) {
        // }
        //if the drop target is different from the last stored reference
        //(or we have one of those references but not the other one)
        // if(droptarget != selections.droptarget) {
        //
        //   //if we have a saved reference, clear its existing dragover class
        //   if(selections.droptarget) {
        //     selections.droptarget.className = selections.droptarget.className.replace(/ dragover/g, '')
        //   }
        //   //apply the dragover class to the new drop target reference
        //   if(droptarget) {
        //     droptarget.className += ' dragover'
        //   }
        //
        //   //then save that reference for next time
        //   selections.droptarget = droptarget
        // }


        //if we have a saved reference, clear its existing dragover class
        if(selections.droptarget) {
          selections.droptarget.className = selections.droptarget.className.replace(/ dragover/g, '')
        }
        //apply the dragover class to the new drop target reference
        if(droptarget) {
          droptarget.className += ' dragover'
        }

        //then save that reference for next time
        selections.droptarget = droptarget
      })
      el.addEventListener('dragover', function(evt) {
        // signed된 항목 return
        if (evt.target.getAttribute('signed') === 'true') {
          return
        }
        // 동일 영역 drag 막음
        if (selections.owner === selections.droptarget) {
          return
        }

        //if we have any selected items, allow them to be dragged
        if(selections.items.length) {
          evt.preventDefault()
        }
      })
      el.addEventListener('dragend', function(evt) {
        // signed된 항목 return
        if (evt.target.getAttribute('signed') === 'true') {
          return
        }

        //if we have a valid drop target reference
        //(which implies that we have some selected items)
        if (selections.droptarget !== null) {
          if (selections.droptarget.id === 'classTab') {
            var groupId = vnode.context.$getUuid()
            for(var len = selections.items.length, i = 0; i < len; i ++) {
              if (targetEle !== null) {
                targetEle.className = targetEle.className.replace(/ translate/g, '')
                targetEle = null
              }

              var params = {
                targetId: selections.droptarget.childNodes[2].children[0].innerText,
                srcId: selections.owner.id,
                image: selections.items[i],
                index: 0,
                groupId: groupId,
                curIndex: i,
                maxSize: selections.items.length
              }

              vnode.context.$emit('APPEND_TAB', {data: params})
            }

            evt.preventDefault()

          } else {
            var insertIndex = selections.droptarget.childNodes.length
            for (var i = 0; i < selections.droptarget.childNodes.length; i++) {
              if (selections.droptarget.childNodes[i] === targetEle) {
                insertIndex = i
              }
            }

            var groupId = vnode.context.$getUuid()
            //append the selected items to the end of the target container
            for(var len = selections.items.length, i = 0; i < len; i ++) {
              if (targetEle != null) {
                var container = getContainer(targetEle)

                // if (targetEle.getAttribute('data-draggable') === 'item' && (selections.droptarget === container)) {
                //   selections.droptarget.insertBefore(selections.items[i], targetEle)
                // } else {
                //   selections.droptarget.appendChild(selections.items[i])
                // }

                targetEle.className = targetEle.className.replace(/ translate/g, '')
                targetEle = null

              } else {
                // selections.droptarget.appendChild(selections.items[i])
              }

              // console.log(vnode.context.$store.getters.getSettings)
              var params = {
                targetId: selections.droptarget.id,
                srcId: selections.owner.id,
                image: selections.items[i],
                index: insertIndex,
                groupId: groupId,
                curIndex: i,
                maxSize: selections.items.length
              }

              vnode.context.$emit('APPEND_CHILD', {data: params})
            }

            //prevent default to allow the action
            evt.preventDefault()
          }
        }

        //if we have any selected items
        if(selections.items.length) {
          //clear dropeffect from the target containers
          clearDropeffects()

          //if we have a valid drop target reference
          if(selections.droptarget) {
            //reset the selections array
            clearSelections()

            //reset the target's dragover class
            selections.droptarget.className = selections.droptarget.className.replace(/ dragover/g, '')

            //reset the target reference
            selections.droptarget = null
          }
        }
      })
      el.addEventListener('drop', function(evt) {
        // signed된 항목 return
        if (evt.target.getAttribute('signed') === 'true') {
          return
        }

        console.log('evt drop')
      })
    }
  })
}

export default DragPlugin
