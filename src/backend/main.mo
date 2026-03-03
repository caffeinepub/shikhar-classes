import Time "mo:core/Time";
import List "mo:core/List";

actor {
  type Board = {
    #ICSE;
    #CBSE;
    #StateBoard;
  };

  type Enquiry = {
    parentName : Text;
    studentName : Text;
    standard : Nat;
    board : Board;
    contactNumber : Text;
    timestamp : Time.Time;
  };

  let enquiries = List.empty<Enquiry>();

  public shared ({ caller }) func submitEnquiry(parentName : Text, studentName : Text, standard : Nat, board : Board, contactNumber : Text) : async () {
    let newEnquiry : Enquiry = {
      parentName;
      studentName;
      standard;
      board;
      contactNumber;
      timestamp = Time.now();
    };
    enquiries.add(newEnquiry);
  };

  public query ({ caller }) func getAllEnquiries() : async [Enquiry] {
    enquiries.toArray();
  };

  public query ({ caller }) func getEnquiryCount() : async Nat {
    enquiries.size();
  };
};
