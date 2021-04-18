import React, { Component } from 'react';
import AddItem from './Popup_Components/AddItem.component';
import ReturnItem from './Popup_Components/ReturnItem.component';
import AddCustomer from './Popup_Components/AddCustomer.component';
import ReturnReceipt from './Popup_Components/ReturnReceipt.component';
import Payment from './Popup_Components/Payment.component';
import ChangeQty from './Popup_Components/ChangeQty.component';
import Constants from '../DTOs/Constants'
import RemoveLine from './Popup_Components/RemoveLine.component';
import LineDisc from './Popup_Components/LineDisc.component';
import TotalDisc from './Popup_Components/TotalDisc.component';
import AbortTxn from './Popup_Components/AbortTxn.component';

class ModalPopup extends Component {
    state = {  }

    CheckSelectedLine(selectedLineNmbr , transaction)
    {
        try
        {
            if(selectedLineNmbr < 1) return null;

            const selectedObj = transaction.txnList.find(x => x.lineNumber === selectedLineNmbr);
            if(selectedObj && selectedObj.lineTypeID === Constants.TxnLineType.ItemLine)
            {
                return selectedObj;
            }
        }
        catch(e)
        {
            console.error(e);
        }
        return null;
    }

    getErrorDiv(text)
    {
        if(!text || text === "")
            text = "Unknown error occured!"

        return ( <div>
                    <div className="modal-dialog " role="document">
                        <div className="modal-content">
                            <div key="modal-header" className="modal-header">
                                <h3 className="modal-title" style={{margin:"auto"}}>  Error! </h3>
                            </div>

                            <div key="modal-body" className="modal-body">
                                <div>
                                    {text} <br/>
                                </div>
                            </div>

                            <div key="modal-footer" className="modal-footer">
                                <button
                                    type="button" className="btn btn-danger" 
                                    id="signIn_FormSubmit" style={{width: "99%",backgroundColor:"#f16b52"}} 
                                    onClick={() => this.props.onModalClose()}  > 
                                    OK
                                </button>
                            </div>
                        </div>
                    </div> 
                </div>);
    }

    render() 
    { 
        let overlayStyle = {
            position: "fixed",
            top:"0",
            left:"0",
            height:"100%",
            width:"100%",
            backgroundColor: "#303841",
            opacity: .65
        };

        let innerlayStyle = {
            position: "fixed",
            top:"0",
            left:"0",
            height:"100%",
            width:"100%",
            paddingTop: "5%"
        };
        

        let returnModal =  this.getErrorDiv("Function Not Found!");

        if(this.props.modalId === Constants.MenuButtonID.AddItem)
            returnModal = <AddItem  doClose={() => this.props.onModalClose()} />
        
        if(this.props.modalId === Constants.MenuButtonID.ReturnItem)
            returnModal = <ReturnItem  doClose={() => this.props.onModalClose()} />
        
        if(this.props.modalId === Constants.MenuButtonID.AddCustomer)
            returnModal = <AddCustomer  doClose={() => this.props.onModalClose()} />
        
        if(this.props.modalId === Constants.MenuButtonID.ChangeQty)
        {
            const itemObj = this.CheckSelectedLine(this.props.clientData.selectedLineNmbr , this.props.transaction);
            if(itemObj && itemObj!=null)
                returnModal = <ChangeQty itemObj={itemObj} doClose={() => this.props.onModalClose()} />
            else
            returnModal = this.getErrorDiv("Please select an Item Line first");
        }

        if(this.props.modalId === Constants.MenuButtonID.LineDisc)
        {
            const itemObj = this.CheckSelectedLine(this.props.clientData.selectedLineNmbr , this.props.transaction);
            if(itemObj && itemObj!=null)
                returnModal = <LineDisc itemObj={itemObj} doClose={() => this.props.onModalClose()} />
            else
            returnModal = this.getErrorDiv("Please select an Item Line first");
        }

        if(this.props.modalId === Constants.MenuButtonID.TotalDisc)
        {
            if(this.props.transaction.txnList.some(x => x.lineTypeID === Constants.TxnLineType.ItemLine))
                returnModal = <TotalDisc transaction = {this.props.transaction} doClose={() => this.props.onModalClose()} />
            else
                returnModal = this.getErrorDiv("Please add items first");
        }

        if(this.props.modalId === Constants.MenuButtonID.RemoveLine)
        {
            const selectedLineNmbr = this.props.clientData.selectedLineNmbr;
            returnModal = <RemoveLine doClose={() => this.props.onModalClose()}
                                    selectedLineNmbr={selectedLineNmbr}
                                    transaction = {this.props.transaction}/>
        }
        
        if(this.props.modalId === Constants.MenuButtonID.ReturnTxn)
            returnModal = <ReturnReceipt  doClose={() => this.props.onModalClose()} />
            
        
        if(this.props.modalId === Constants.MenuButtonID.ReturnReceipt)
            returnModal = <ReturnReceipt  doClose={() => this.props.onModalClose()} />

        if(this.props.modalId === Constants.MenuButtonID.AbortTxn)
            returnModal = <AbortTxn  doClose={() => this.props.onModalClose()} />

        if(this.props.modalId >= 100)
        {   
            returnModal = <Payment doClose={() => this.props.onModalClose()} 
                    endTxn={() => this.props.endTxn()} 
                    paymentTypeID = {this.props.modalId}
                    serverData = {this.props.serverData} 
                    transaction = {this.props.transaction} /> 
        }
        
            

        return ( 
            <div  style={innerlayStyle} >
                <div style={overlayStyle} >
                </div> 
                { this.props.modalId > 0 &&  returnModal }
            </div>
        );
    }
}
 
export default ModalPopup;