import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';

const tutorialSteps = [
  {
    label: 'How to be happy :)',
    imgPath: '/static/images/steppers/1-happy.jpg',
  },
  {
    label: '1. Work with something that you like, like…',
    imgPath: '/static/images/steppers/2-work.jpg',
  },
  {
    label: '2. Keep your friends close to you and hangout with them',
    imgPath: '/static/images/steppers/3-friends.jpg',
  },
  {
    label: '3. Travel everytime that you have a chance',
    imgPath: '/static/images/steppers/4-travel.jpg',
  },
  {
    label: '4. And contribute to Material-UI :D',
    imgPath: '/static/images/steppers/5-mui.png',
  },
];

const styles = theme => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing.unit * 4,
    marginBottom: 20,
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
  },
});

class SwipeableTextMobileStepper extends React.Component {
  constructor(props)
  {
    super(props);

    console.log("props", props);

    this.state = {
      activeStep: 0,
    };
  }

  componentWillReceiveProps(nextProps)
  {
    console.log("componentWillReceiveProps");
    console.log("nextProps", nextProps);
  }

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }));
  };

  handleStepChange = activeStep => {
    this.setState({ activeStep });
  };

  render() {
    const {
      classes,
      theme,
      bracket_SideA_Transpose,
      bracket_SideB_Transpose,
      bracketId,
      owner,
      handleClickFor_FillSeat,
      handleClickFor_PromoteSeat
    } = this.props;

    var bracket_Transpose = bracket_SideA_Transpose.concat(bracket_SideB_Transpose);
    var number_ColumnsPerSide = bracket_Transpose.length / 2;

    const {
      activeStep
    } = this.state;

    const maxSteps = bracket_Transpose.length;

    return (
      <div className={classes.root}>

        {/*<Paper square elevation={0} className={classes.header}>
          <Typography>{tutorialSteps[activeStep].label}</Typography>
        </Paper>*/}

        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.activeStep}
          onChangeIndex={this.handleStepChange}
          enableMouseEvents
        >
          {
            bracket_Transpose.map((column, index) => {

              // Side A
              if (index == 0)
              {
                if (number_ColumnsPerSide - 1 >= index )
                  return <Column
                    key={index}
                    column={column}
                    columnIndex={index}
                    number_ColumnsPerSide={number_ColumnsPerSide}
                    bracketId={bracketId}
                    bracketData_Transpose={bracket_SideA_Transpose}
                    owner={owner}
                    side="A"
                    isFirstColumn={true}
                    isLastColumn={false}
                    handleClickFor_FillSeat={handleClickFor_FillSeat}
                    handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
                  />
              }
              else
              {
                if (number_ColumnsPerSide - 1 >= index )
                  return <Column
                    key={index}
                    column={column}
                    columnIndex={index}
                    number_ColumnsPerSide={number_ColumnsPerSide}
                    bracketId={bracketId}
                    bracketData_Transpose={bracket_SideA_Transpose}
                    owner={owner}
                    side="A"
                    isFirstColumn={false}
                    isLastColumn={false}
                    handleClickFor_FillSeat={handleClickFor_FillSeat}
                    handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
                  />
              }

              // Side B
              if (index == (number_ColumnsPerSide * 2 - 1))
              {
                if (number_ColumnsPerSide - 1 < index)
                  return <Column
                    key={index}
                    column={column}
                    columnIndex={index - number_ColumnsPerSide}
                    number_ColumnsPerSide={number_ColumnsPerSide}
                    bracketId={bracketId}
                    bracketData_Transpose={bracket_SideB_Transpose}
                    owner={owner}
                    side="B"
                    isFirstColumn={false}
                    isLastColumn={true}
                    handleClickFor_FillSeat={handleClickFor_FillSeat}
                    handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
                  />
              }
              else
              {
                if (number_ColumnsPerSide - 1 < index)
                  return <Column
                    key={index}
                    column={column}
                    columnIndex={index - number_ColumnsPerSide}
                    number_ColumnsPerSide={number_ColumnsPerSide}
                    bracketId={bracketId}
                    bracketData_Transpose={bracket_SideB_Transpose}
                    owner={owner}
                    side="B"
                    isFirstColumn={false}
                    isLastColumn={false}
                    handleClickFor_FillSeat={handleClickFor_FillSeat}
                    handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
                  />
              }
            })
          }
        </SwipeableViews>

        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          className={classes.mobileStepper}
          nextButton={
            <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />

      </div>
    );
  }
}

function Column(props)
{
  const {
    column,
    columnIndex,
    number_ColumnsPerSide,
    side,
    bracketId,
    bracketData_Transpose,
    owner,
    isFirstColumn,
    isLastColumn,
    handleClickFor_FillSeat,
    handleClickFor_PromoteSeat
  } = props;

  console.log(side);

  return (
    <div className="bracket">
      {
        column.map((cell, index) => (
          <Cell
            key={index}
            item={cell}
            bracketId={bracketId}
            bracketData_Transpose={bracketData_Transpose}
            owner={owner}
            side={side}
            number_ColumnsPerSide={number_ColumnsPerSide}
            columnIndex={columnIndex}
            isFirstColumn={isFirstColumn}
            isLastColumn={isLastColumn}
            handleClickFor_FillSeat={handleClickFor_FillSeat}
            handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
          />
        ))
      }
    </div>
  );
}

function Cell(props)
{
  let {
    item,
    side,
    bracketId,
    bracketData_Transpose,
    number_ColumnsPerSide,
    owner,
    columnIndex,
    isFirstColumn,
    isLastColumn,
    handleClickFor_FillSeat,
    handleClickFor_PromoteSeat
  } = props;

  var style = "";

  var text = "X";
  var index = "";

  var isPromoActionProhibited = false;
  var isJoinActionProhibited = false;

  if (typeof item === 'object')
  {
    var head = item.value.substring(0, 5);
    var tail = item.value.substring(item.value.length - 5, item.value.length);
    text = head + '...' + tail;

    if (text == "0x000...00000")
    {
      if (side == "A")
      {
        style = "cell-side-a-player";
      }
      if (side == "B")
      {
        style = "cell-side-b-player";
      }

      isPromoActionProhibited = true;
    }
    else
    {
      if (side == "A")
      {
        style = "cell-side-a-player-highlight";
      }
      if (side == "B")
      {
        style = "cell-side-b-player-highlight";
      }

      if (item.value == window.window.authorizedAccount)
      {
        style = "highlight-authorized";
      }

      isJoinActionProhibited = true;
    }

    text = item.index + " : " + text;
    index = item.index;
  }

  if (!item.promo)
  {
    isPromoActionProhibited = true;
  }

  var showJoinButton_SideA = false
  var showJoinButton_SideB = false

  if (side == "A")
  {
    if (columnIndex == 0)
    {
      showJoinButton_SideA = true;

      var column = bracketData_Transpose[columnIndex];

      var records = _.filter(column, {value: window.authorizedAccount});

      if (records.length > 0)
      {
        showJoinButton_SideA = false;
      }
    }
  }

  if (side == "B")
  {
    if (columnIndex == (number_ColumnsPerSide - 1))
    {
      showJoinButton_SideB = true

      var column = bracketData_Transpose[columnIndex];

      var records = _.filter(column, {value: window.authorizedAccount});

      if (records.length > 0)
      {
        showJoinButton_SideB = false;
      }
    }
  }

  var address = item.value;

  var enabled = false;

  if (index != "")
  {
    enabled = true;
  }

  var isModerator = false;
  if (window.authorizedAccount == owner)
  {
    isModerator = true;
  }

  return (
    enabled ? (
      <div className={style}>
        {
          side == "A" &&
            <div>
              {
                showJoinButton_SideA && !isModerator && !isJoinActionProhibited &&
                  <ActionLink_FillSeat
                    bracketId={bracketId}
                    owner={owner}
                    side={side}
                    seat={index}
                    handleClickFor_FillSeat={handleClickFor_FillSeat}
                  />
              }
              &nbsp;{text}&nbsp;
              {
                isModerator && !isPromoActionProhibited &&
                  <ActionLink_PromoteSeat
                    bracketId={bracketId}
                    owner={owner}
                    side={side}
                    seat={index}
                    address={address}
                    handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
                  />
              }
            </div>
        }

        {
          side == "B" &&
            <div>
              {
                isModerator && !isPromoActionProhibited &&
                  <ActionLink_PromoteSeat
                    bracketId={bracketId}
                    owner={owner}
                    side={side}
                    seat={index}
                    address={address}
                    handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
                  />
              }
              &nbsp;{text}&nbsp;
              {
                showJoinButton_SideB && !isModerator && !isJoinActionProhibited &&
                  <ActionLink_FillSeat
                    bracketId={bracketId}
                    owner={owner}
                    side={side}
                    seat={index}
                    handleClickFor_FillSeat={handleClickFor_FillSeat}
                  />
              }
            </div>
        }
      </div>
    ) : (
      <div className={style}>
        {text}
      </div>
    )
  );
}

function ActionLink_FillSeat(props)
{
  var {
    bracketId,
    owner,
    side,
    seat,
    handleClickFor_FillSeat
  } = props;

  function handleClick(bracketId, side, seat, e)
  {
    handleClickFor_FillSeat(bracketId, side, seat, e)
  }

  return (
      <a href="#" onClick={(e) => handleClick(bracketId, side, seat, e)}>+</a>
  );
}

function ActionLink_PromoteSeat(props)
{
  var {
    bracketId,
    owner,
    side,
    seat,
    address,
    handleClickFor_PromoteSeat
  } = props;

  function handleClick(bracketId, side, seat, address, e)
  {
    handleClickFor_PromoteSeat(bracketId, side, seat, address, e);
  }

  var button = ""

  if (side == "A")
  {
    button = "-->";
  }

  if (side == "B")
  {
    button = "<--";
  }

  return (
      <a href="#" onClick={(e) => handleClick(bracketId, side, seat, address, e)}>{button}</a>
  );
}

SwipeableTextMobileStepper.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SwipeableTextMobileStepper);
