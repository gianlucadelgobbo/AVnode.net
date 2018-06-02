import React, {Component} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {MODAL_REMOVE} from "../modal/constants";
import {Button, Image} from 'react-bootstrap';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: grid,
    overflow: 'auto',
});

class Reorder extends Component {

    constructor(props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const {items, onChange} = this.props;

        const orderedItems = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        onChange(orderedItems)
    }

    renderImage(item, index) {
        let {showModal, onRemove} = this.props;
        return <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}
                    className="Row"
                >
                    <div className="col-sm-12">
                        <h3>{item.title} <Button bsStyle="danger"
                                                 onClick={() =>
                                                     showModal({
                                                         type: MODAL_REMOVE,
                                                         props: {
                                                             onRemove: () => onRemove(item)
                                                         }
                                                     })}
                        >
                            <i className="fa fa-trash" data-toggle="tooltip"
                               data-placement="top"/>
                        </Button>
                        </h3>
                        <Image src={item.image ? item.image.file : ""} responsive/>;
                    </div>

                </div>
            )}
        </Draggable>
    }

    render() {

        let {items} = this.props;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>

                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {items.map(this.renderImage.bind(this))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

            </DragDropContext>
        );
    }
}

export default Reorder;

