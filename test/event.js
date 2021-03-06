var assert = require('assert');
var expect = require('chai').expect;
var sinon = require('sinon');
var PassThrough = require('stream').PassThrough;
var request = require('request');

var api = require('../index.js')('aToken');

describe('events', function() {

    var testAccount, testProject, testEvent;

    it('should get an account (GET /accounts/:account_id)', function(done) {
        var get = sinon.stub(request, 'get').yields(null, null, { id: 1 });

		api.getAccount(1, function(err, account) {
            testAccount = account;
            expect(account.id).to.exist;

            get.restore();
			done();
		});
	});

    it('should get account projects (GET /:account_id/projects)', function(done) {
        var getProjects = sinon.stub(request, 'get').yields(null, null, [ { account_id: 1, id: 5 }, { account_id: 1, id: 6 } ]);

		testAccount.projects(function(err, projects) {
            expect(projects.length).to.equal(2);
            expect(projects[0].id).to.exist;
            expect(projects[0].account_id).to.equal(1);

            testProject = projects[0];
            getProjects.restore();
			done();
		});
	});

    it('project entity has methods', function(done) {
        expect(testProject.get).to.exist;
        expect(testProject.delete).to.exist;
        expect(testProject.update).to.exist;
        done();
    });

    it('should create an a account event (POST /:account_id/events)', function(done) {
        var postRequest = sinon.stub(request, 'post').yields(null, null, { account_id: 222, id: 1212 });

    	testAccount.createEvent({ name: 'Test' }, function(err, event) {
            // Was the mock called.
            expect(postRequest.calledOnce).to.be.true;

            // Do we get an array of two items.
            expect(event.id).to.exist;
            expect(event.id).to.equal(1212);

            // Does the prototype contains have its methods.
            expect(event.id).to.exist;
            expect(event.update).to.exist;
            expect(event.delete).to.exist;
            expect(event.get).to.exist;

            testEvent = event;

            postRequest.restore();
    		done();
    	});
    });

    it('should update a account event (PUT /:account_id/events/:event_id)', function(done) {
        var putRequest = sinon.stub(request, 'put').yields(null, null, { id: 1212, account_id: 222, time: 10 });

    	testEvent.update({ name: 'Test' }, function(err, event) {
            // Was the mock called.
            expect(putRequest.calledOnce).to.be.true;

            // Do we get an array of two items.
            expect(event.id).to.exist;
            expect(event.id).to.equal(1212);

            // Does the prototype contains have its methods.
            expect(event.id).to.exist;
            expect(event.update).to.exist;
            expect(event.delete).to.exist;
            expect(event.get).to.exist;

            putRequest.restore();
    		done();
    	});
    });

    it('should delete account event (DEL /:account_id/events/:event_id)', function(done) {
        var deleteRequest = sinon.stub(request, 'delete').yields(null, null, { status: true });

    	testEvent.delete(function(err, event) {
            // Was the mock called.
            expect(deleteRequest.calledOnce).to.be.true;

            deleteRequest.restore();
    		done();
    	});
    });

    it('should get account event (GET /:account_id/events/:event_id)', function(done) {
        var getRequest = sinon.stub(request, 'get').yields(null, null, { id: 1212, account_id: 222, time: 10 });

    	testEvent.get(function(err, event) {
            expect(getRequest.calledOnce).to.be.true;

            // Do we get an array of two items.
            expect(event.id).to.exist;
            expect(event.id).to.equal(1212);

            // Does the prototype contains have its methods.
            expect(event.id).to.exist;
            expect(event.update).to.exist;
            expect(event.delete).to.exist;
            expect(event.get).to.exist;

            getRequest.restore();
    		done();
    	});
    });

    it('should update event product (GET /:account_id/projects/:project_id/events/:event_id)', function(done) {
        var putRequest = sinon.stub(request, 'put').yields(null, null, { id: 1212, account_id: 222, project_id: 222, time: 10 });

    	testEvent.changeProject(222, function(err, event) {
            expect(putRequest.calledOnce).to.be.true;

            // Do we get an array of two items.
            expect(event.id).to.exist;
            expect(event.id).to.equal(1212);
            expect(event.project_id).to.equal(222);

            // Does the prototype contains have its methods.
            expect(event.id).to.exist;
            expect(event.update).to.exist;
            expect(event.delete).to.exist;
            expect(event.get).to.exist;

            putRequest.restore();
    		done();
    	});
    });

    it('should update event user (GET /:account_id/users/:project_id/events/:event_id)', function(done) {
        var putRequest = sinon.stub(request, 'put').yields(null, null, { id: 1212, account_id: 222, user_id: 333, time: 10 });

    	testEvent.changeUser(333, function(err, event) {
            expect(putRequest.calledOnce).to.be.true;

            // Do we get an array of two items.
            expect(event.id).to.exist;
            expect(event.id).to.equal(1212);
            expect(event.user_id).to.equal(333);

            // Does the prototype contains have its methods.
            expect(event.id).to.exist;
            expect(event.update).to.exist;
            expect(event.delete).to.exist;
            expect(event.get).to.exist;

            putRequest.restore();
    		done();
    	});
    });

});
