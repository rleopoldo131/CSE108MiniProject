from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from sqlalchemy.orm import scoped_session





from ..models import User
from ..database import Session

bp = Blueprint('auth', __name__)

@bp.route('/')
def home():
    return redirect('/login')

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        session = scoped_session(Session)
        user = session.query(User).filter_by(username=username).first()
        session.close()

        if user and check_password_hash(user.password, password):
            login_user(user)
            if user.role == 'student':
                return redirect('/student')
            elif user.role == 'teacher':
                return redirect('/teacher')
            elif user.role == 'admin':
                return redirect('/admin')  # Flask-Admin
        else:
            flash('Invalid credentials')
    
    return render_template('login.html')


@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
